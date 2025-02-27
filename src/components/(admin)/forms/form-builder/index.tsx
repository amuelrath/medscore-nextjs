'use client';

import { AssessmentSidebar } from '@/components/(admin)/forms/form-builder/assessment-sidebar';
import { useFormBuilderDrag } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-drag';
import { FormBuilderSidebar } from '@/components/(admin)/forms/form-builder/sidebar';
import {
  DEFAULT_SETTINGS,
  useFormBuilderStore,
} from '@/components/(admin)/forms/form-builder/store';
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

const SCHEMA_MAP = {
  MULTIPLE_CHOICE: ZChoiceQuestionSchema,
  SINGLE_CHOICE: ZChoiceQuestionSchema,
  RANGE: ZRangeQuestionSchema,
  WRITTEN: ZWrittenQuestionSchema,
  PARAGRAPH: ZParagraphSchema,
  HEADER: ZHeaderSchema,
} as const;

function apiToState({
  data,
}: {
  data: FormResult;
}): TFormBuilderSchema {

  const addMilestoneIds = (item: FormResult['formItems'][number]) => ({
    ...item,
    milestoneIds:
      item.milestones?.map(
        (m: FormResult['formItems'][number]['milestones'][number]) =>
          m.milestoneId,
      ) ?? [],
  });

  const parseFormItem = (item: FormResult['formItems'][number]) => {
    const schema = SCHEMA_MAP[item.type];
    const itemWithMilestones = [
      'MULTIPLE_CHOICE',
      'SINGLE_CHOICE',
      'RANGE',
    ].includes(item.type)
      ? addMilestoneIds(item)
      : item;

    return schema.parse(itemWithMilestones);
  };

  const formItems = data.formItems
    .map(parseFormItem)
    .sort((a, b) => a.position - b.position);

  return {
    id: data.id,
    title: data.title,
    settings: data.settings ?? DEFAULT_SETTINGS,
    formItems,
  };
}

export function FormBuilder() {
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
      const transformedData = apiToState({ data });
      useFormBuilderStore.setState({
        items: transformedData.formItems,
        settings: transformedData.settings,
        title: transformedData.title,
        activeItemId: null,
        selectedItemId: null,
      });
      console.log("Initial data loaded and set")
    }
  }, [data]);

  if (isLoading) return 'Loading';
  if (!data) return 'no data!!!';

  // initialize autosave

  return (
    <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
      <FormBuilderToolbar />
      <DragAndDropWrapper />
    </section>
  );
}

function DragAndDropWrapper() {
  const { ...dragHandlers } = useFormBuilderDrag();

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
      <div className="grid grid-cols-12 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
        <FormBuilderSidebar />
        <FormBuilderCanvas />
        <AssessmentSidebar />
      </div>
    </DndContext>
  );
}
