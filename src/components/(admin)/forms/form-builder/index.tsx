'use client';

import { AssessmentSidebar } from '@/components/(admin)/forms/form-builder/assessment-sidebar';
import { useFormBuilderDrag } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-drag';
import { FormBuilderSidebar } from '@/components/(admin)/forms/form-builder/sidebar';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { FormBuilderToolbar } from '@/components/(admin)/forms/form-builder/toolbar';
import {
  TFormBuilderSchema,
  ZChoiceQuestionSchema,
  ZHeaderSchema,
  ZParagraphSchema,
  ZRangeQuestionSchema,
  ZWrittenQuestionSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { FormResult, getFormById } from '@/server/actions/forms/get-form-by-id';
import { closestCorners, DndContext, MeasuringStrategy } from '@dnd-kit/core';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

// requires document to be defined.
const FormBuilderCanvas = dynamic(
  () =>
    import('@/components/(admin)/forms/form-builder/canvas').then(
      (module) => module.FormBuilderCanvas,
    ),
  { ssr: false },
);

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

function transformFormData({ data }: { data: FormResult | undefined }): TFormBuilderSchema | undefined {
  if (!data) return undefined ;

  // transform the form items
  const rawChoice = data.formItems.filter(
    (i) => i.type === 'MULTIPLE_CHOICE' || i.type === 'SINGLE_CHOICE',
  );
  const rawRange = data.formItems.filter((i) => i.type === 'RANGE');
  const rawWritten = data.formItems.filter((i) => i.type === 'WRITTEN');
  const rawParagraph = data.formItems.filter((i) => i.type === 'PARAGRAPH');
  const rawHeader = data.formItems.filter((i) => i.type === 'HEADER');

  // get the milestones in there
  const rawRangeWithMilestones = rawRange.map(r =>( { ...r, milestoneIds: [...r.milestones.map(m => m.milestoneId)] }))
  const rawChoiceWithMilestones = rawChoice.map(r =>( { ...r, milestoneIds: [...r.milestones.map(m => m.milestoneId)] }))

  // zod parse!!
  const parsedChoice = rawChoiceWithMilestones.map((c) => ZChoiceQuestionSchema.parse(c));
  const parsedRange = rawRangeWithMilestones.map((r) => ZRangeQuestionSchema.parse(r));
  const parsedWritten = rawWritten.map((w) => ZWrittenQuestionSchema.parse(w));
  const parsedParagraph = rawParagraph.map((p) => ZParagraphSchema.parse(p));
  const parsedHeader = rawHeader.map((h) => ZHeaderSchema.parse(h));

  const allQuestions = [
    ...parsedChoice,
    ...parsedRange,
    ...parsedWritten,
    ...parsedParagraph,
    ...parsedHeader,
  ].sort((a, b) => a.position - b.position);

  return {
    id: data.id,
    title: data.title,
    formItems: allQuestions,
  };
}

export function FormBuilder() {
  const { setItems } = useFormBuilderStore();
  const dragHandlers = useFormBuilderDrag();

  // first we should get the form's id from search params
  const params = useParams();
  const formId = params.formId.toString();

  // get the data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['form', formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
    staleTime: 60 ** 3, // one hour
  });


  useEffect(() => {
    if (data) {
      const transformedData = transformFormData({ data });
      setItems(transformedData?.formItems || []);
    }
  }, [data, setItems]);

  if (isLoading) return 'Loading';
  if (!data) return 'no data!!!';

  // initialize autosave

  return (
    <DndContext
      onDragOver={dragHandlers.handleDragOver}
      onDragMove={dragHandlers.handleDragMove}
      onDragEnd={dragHandlers.handleDragEnd}
      onDragStart={dragHandlers.handleDragStart}
      onDragCancel={dragHandlers.handleDragCancel}
      measuring={measuringConfig}
      collisionDetection={closestCorners}
    >
      <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
        <FormBuilderToolbar />
        <div className="grid grid-cols-12 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
          <FormBuilderSidebar />
          <FormBuilderCanvas />
          <AssessmentSidebar />
        </div>
      </section>
    </DndContext>
  );
}
