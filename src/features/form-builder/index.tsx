'use client';

import Loading from '@/components/ui/loading';
import { AssessmentSidebar } from '@/features/form-builder/components/assessment-sidebar';
import { FormBuilderSidebar } from '@/features/form-builder/components/components-sidebar';
import { FormBuilderToolbar } from '@/features/form-builder/components/toolbar';
import { useFormBuilderDrag } from '@/features/form-builder/hooks/use-form-builder-drag';
import {
  ZChoiceQuestionSchema,
  ZHeaderSchema,
  ZParagraphSchema,
  ZRangeQuestionSchema,
  ZWrittenQuestionSchema,
} from '@/features/form-builder/schemas/form-item-schemas';
import {
  DEFAULT_SETTINGS,
  useFormBuilderStore,
} from '@/features/form-builder/store';
import { TFormBuilderSchema } from '@/features/form-builder/types';
import { useUndoRedoShortcuts } from '@/hooks/use-undo-redo-shortcuts';
import { FormResult, getFormById } from '@/actions/forms/get-form-by-id';
import {
  CollisionDetection,
  DndContext,
  MeasuringStrategy,
  rectIntersection,
} from '@dnd-kit/core';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const FormBuilderCanvas = dynamic(
  () =>
    import('@/features/form-builder/components/canvas').then(
      (module) => module.FormBuilderCanvas,
    ),
  { ssr: false, loading: (loadingProps) => <CanvasFallback /> },
);

// requires document to be defined.

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

function apiToState({ data }: { data: FormResult }): TFormBuilderSchema {
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

const fixCursorSnapOffset: CollisionDetection = (args) => {
  // Bail out if keyboard activated
  if (!args.pointerCoordinates) {
    return rectIntersection(args);
  }
  const { x, y } = args.pointerCoordinates;
  const { width, height } = args.collisionRect;
  const updated = {
    ...args,
    // The collision rectangle is broken when using snapCenterToCursor. Reset
    // the collision rectangle based on pointer location and overlay size.
    collisionRect: {
      width,
      height,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
    },
  };
  return rectIntersection(updated);
};

export function FormBuilder() {
  // first we should get the form's id from search params
  const params = useParams();
  const formId = params.formId?.toString();

  const setIsInitialized = useFormBuilderStore(
    (state) => state.setIsInitialized,
  );
  const isInitialized = useFormBuilderStore((state) => state.isInitialized);

  const { undo, redo, clear } = useFormBuilderStore.temporal.getState();
  useUndoRedoShortcuts(undo, redo);

  // get the data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['form', formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
    staleTime: 60 ** 3, // one hour
  });

  useEffect(() => {
    // Reset initialized state while loading
    if (isLoading) {
      setIsInitialized(false);
      return;
    }

    if (data) {
      const transformedData = apiToState({ data });

      // Set all state in one update
      useFormBuilderStore.setState({
        id: transformedData.id,
        items: transformedData.formItems,
        settings: transformedData.settings,
        title: transformedData.title,
        activeItemId: null,
        selectedItemId: null,
        isInitialized: true,
      });

      clear();
      // console.log('Initial data loaded and set, isInitialized = true');
    } else {
      setIsInitialized(false);
      // console.log('No data available, isInitialized = false');
    }
  }, [data, isLoading, setIsInitialized]); // do not change dependencies! (idk the error but i know its intentional

  if (isLoading) return 'Loading';
  if (!data) return 'no data!!!';

  return (
    <section className="flex flex-col flex-grow h-[calc(100vh-40px)]">
      {/* Only render toolbar when initialization is complete */}
      {isInitialized ? (
        <>
          <FormBuilderToolbar />
          <DragAndDropWrapper />
        </>
      ) : (
        <div className="h-full outline flex-grow flex flex-col items-center">
          <Loading />
        </div>
      )}
    </section>
  );
}

function DragAndDropWrapper() {
  const { sensors, ...dragHandlers } = useFormBuilderDrag();

  return (
    <DndContext
      onDragOver={dragHandlers.handleDragOver}
      onDragMove={dragHandlers.handleDragMove}
      onDragEnd={dragHandlers.handleDragEnd}
      onDragStart={dragHandlers.handleDragStart}
      onDragCancel={dragHandlers.handleDragCancel}
      measuring={measuringConfig}
      sensors={sensors}
      collisionDetection={fixCursorSnapOffset}
    >
      <div className="grid grid-cols-12 min-h-[calc(100vh-40px-70.73px)] max-h-[calc(100vh-40px-70.73px)]">
        <FormBuilderSidebar />
        <FormBuilderCanvas />
        <AssessmentSidebar />
      </div>
    </DndContext>
  );
}

function CanvasFallback() {
  return (
    <div
      className={`col-span-5 calc(100vh-${40}px-${70.73}px) bg-[radial-gradient(hsl(var(--primary)/0.2)_1px,transparent_1px)] [background-size:16px_16px]`}
    >
      <Loading />
    </div>
  );
}

DragAndDropWrapper.displayName = 'DragAndDropWrapper';
FormBuilder.displayName = 'FormBuilder';
