import {
  MultipleChoiceQuestion,
  SingleChoiceQuestion,
} from '@/components/(admin)/forms/form-builder/form-items/choice-question';
import { RangeQuestion } from '@/components/(admin)/forms/form-builder/form-items/range-question';
import {
  HeaderItem,
  ParagraphItem,
} from '@/components/(admin)/forms/form-builder/form-items/text-item';
import { WrittenQuestion } from '@/components/(admin)/forms/form-builder/form-items/written-question';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { TFormItemSchema } from '@/components/(admin)/forms/form-builder/types';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/helpers/utils';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { CopyIcon, GripVerticalIcon, XIcon } from 'lucide-react';
import React, { JSXElementConstructor, useCallback, useMemo } from 'react';

// Memoized form item components map
const formItemContent: Record<
  TFormItemSchema['type'],
  JSXElementConstructor<{ id: string }>
> = {
  WRITTEN: React.memo(WrittenQuestion),
  HEADER: React.memo(HeaderItem),
  PARAGRAPH: React.memo(ParagraphItem),
  RANGE: React.memo(RangeQuestion),
  SINGLE_CHOICE: React.memo(SingleChoiceQuestion),
  MULTIPLE_CHOICE: React.memo(MultipleChoiceQuestion),
};

interface FormItemProps {
  id: string;
  index: number;
  isClone?: boolean;
}

const animateLayoutChanges = (args: any) => {
  const { isSorting, wasSorting } = args;
  return isSorting || wasSorting ? defaultAnimateLayoutChanges(args) : true;
};

export const FormItem = React.memo(({ id, index, isClone }: FormItemProps) => {
  // Use selector pattern to minimize re-renders
  const item = useFormBuilderStore((state) =>
    state.items.find((i) => i.id === id),
  );
  const activeItemId = useFormBuilderStore((state) => state.activeItemId);
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId);
  const duplicateItem = useFormBuilderStore((state) => state.duplicateItem);
  const removeItem = useFormBuilderStore((state) => state.removeItem);
  const setSelectedItemId = useFormBuilderStore(
    (state) => state.setSelectedItemId,
  );
  const itemDropIndex = useFormBuilderStore((state) => state.itemDropIndex);
  const itemsLength = useFormBuilderStore((state) => state.items.length);

  // Compute derived state
  const isActive = activeItemId === id;
  const isSelected = selectedItemId === id;

  // Memoize event handlers
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeItem(id);
    },
    [id, removeItem],
  );

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateItem(id);
    },
    [id, duplicateItem],
  );

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedItemId(id);
    },
    [id, setSelectedItemId],
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    active,
  } = useSortable({
    id,
    data: { type: 'item' },
    animateLayoutChanges,
  });

  const isActiveTypeNewItem = active?.id.toString().startsWith('new-item');

  // Memoize styles
  const style = useMemo(
    () => ({
      transform: isActiveTypeNewItem
        ? undefined
        : CSS.Translate.toString(transform),
      transition: `${transition}, border 200ms ease, border-color 200ms ease`,
      border: isActive ? '1.55px solid' : '1.5px solid',
      borderColor: isActive
        ? 'hsl(var(--foreground) / 0.3)'
        : 'hsl(var(--border))',
    }),
    [isActiveTypeNewItem, transform, transition, isActive],
  );

  const motionAnimateStyle = useMemo(
    () => ({
      scale: isActive ? 1.025 : 1,
    }),
    [isActive],
  );

  const transitionStyle = useMemo(
    () => ({
      transitionProperty: 'filter',
      transitionDuration: '500ms',
      transitionTimingFunction: 'ease',
    }),
    [],
  );

  if (!item) return null;

  const position = index + 1;
  const Content = formItemContent[item.type];

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={motionAnimateStyle}
      className={cn(
        'col-start-2 col-span-6 flex origin-center flex-col',
        isActive && 'z-40 drop-shadow-xl ease-in duration-300',
        isDragging && !isClone && 'opacity-0',
      )}
      style={transitionStyle}
    >
      {!isClone && (
        <motion.span
          animate={{
            height:
              isActiveTypeNewItem && itemDropIndex === index ? '36px' : '0px',
          }}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        className="flex bg-white flex-row rounded shadow-sm mb-2"
      >
        <div className="flex flex-col p-1 justify-center items-center">
          <GripVerticalIcon
            {...listeners}
            {...attributes}
            role="button"
            size={20}
            className={cn(
              'text-primary/40 cursor-move hover:text-primary/70 transition-colors',
              isClone && 'pointer-events-none',
            )}
          />
        </div>
        <button
          type="button"
          aria-label="form-item"
          onMouseUp={handleSelect}
          className="space-y-2 select-none flex-grow pr-7 pl-0.5"
        >
          <div className="w-full h-6 flex flex-row justify-between">
            <span
              className={cn(
                'text-white flex items-center justify-center text-sm w-8 rounded-b transition-colors ease-out duration-[50ms]',
                isSelected ? 'bg-primary/90' : 'bg-primary/60',
              )}
            >
              {position}
            </span>
            <div
              className={cn(
                'flex text-center justify-center px-4 rounded-b space-x-4 items-center transition-colors ease-out duration-[50ms]',
                isSelected ? 'bg-primary/90' : 'bg-primary/60',
              )}
            >
              <CopyIcon
                onClick={handleCopy}
                role="button"
                size={13}
                className="text-white hover:text-accent transition-colors"
              />
              <XIcon
                onClick={handleDelete}
                role="button"
                size={16}
                className="text-white hover:text-destructive transition-colors"
              />
            </div>
          </div>
          <CardContent className="flex-grow pb-2 px-0">
            <AnimatePresence initial={false}>
              <Content id={id} />
            </AnimatePresence>
          </CardContent>
        </button>
      </div>
      {!isClone && index === itemsLength - 1 && (
        <span
          className={cn(
            'h-[1px] bg-accent-secondary/40 w-full rounded-full',
            isSorting && 'transition-opacity duration-100 ease-in',
            isActiveTypeNewItem && itemDropIndex === index + 1
              ? 'opacity-100'
              : 'opacity-0',
          )}
        />
      )}
    </motion.div>
  );
});
