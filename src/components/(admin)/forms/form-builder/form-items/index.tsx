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
import { motion } from 'framer-motion';
import { CopyIcon, GripVerticalIcon, XIcon } from 'lucide-react';
import React, { JSXElementConstructor } from 'react';

const formItemContent: Record<
  TFormItemSchema['type'],
  JSXElementConstructor<{ id: string }>
> = {
  WRITTEN: WrittenQuestion,
  HEADER: HeaderItem,
  PARAGRAPH: ParagraphItem,
  RANGE: RangeQuestion,
  SINGLE_CHOICE: SingleChoiceQuestion,
  MULTIPLE_CHOICE: MultipleChoiceQuestion,
};

interface FormItemProps {
  id: string;
  index: number;
  type: TFormItemSchema['type'];
  isClone?: boolean;
}

const animateLayoutChanges = (args: any) => {
  const { isSorting, wasSorting } = args;
  return isSorting || wasSorting ? defaultAnimateLayoutChanges(args) : true;
};

export const FormItem = React.memo(
  ({ id, type, index, isClone }: FormItemProps) => {
    const {
      removeItem,
      itemDropIndex,
      duplicateItem,
      activeItemId,
      items,
      setSelectedItemId,
      selectedItemId,
    } = useFormBuilderStore();

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
    const isActive = activeItemId === id;
    const isSelected = selectedItemId === id;

    const style = {
      transform: isActiveTypeNewItem
        ? undefined
        : CSS.Translate.toString(transform),
      transition: `${transition}, border 200ms ease, border-color 200ms ease`,
      border: isActive ? '1.55px solid' : '1.5px solid',
      borderColor: isActive
        ? 'hsl(var(--foreground) / 0.3)'
        : 'hsl(var(--border))',
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      removeItem(id);
    };

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateItem(id);
    };

    const handleSelect = (e: React.MouseEvent) => {
      e.stopPropagation(); // not sure if i need this
      setSelectedItemId(id);
    };

    const position = index + 1;

    const Content = formItemContent[type];

    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isActive ? 1.025 : 1 }}
        className={cn(
          'col-start-2 col-span-6 flex origin-center flex-col',
          isActive && 'z-40 drop-shadow-xl ease-in duration-300',
          isDragging && !isClone && 'opacity-0',
        )}
        style={{
          transitionProperty: 'filter',
          transitionDuration: '500ms',
          transitionTimingFunction: 'ease',
        }}
      >
        {!isClone && (
          <span
            className={cn(
              'h-1 mb-2 bg-accent-secondary/40 w-full rounded-full',
              isSorting && 'transition-opacity duration-100 ease-in',
              isActiveTypeNewItem && itemDropIndex === index
                ? 'opacity-100'
                : 'opacity-0',
            )}
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
                'text-primary/40 hover:text-primary/70 transition-colors',
                isClone && 'pointer-events-none',
              )}
            />
          </div>
          <div
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
              <Content id={id} />
            </CardContent>
          </div>
        </div>
        {!isClone && index === items.length - 1 && (
          <span
            className={cn(
              'h-1 bg-accent-secondary/40 w-full rounded-full',
              isSorting && 'transition-opacity duration-100 ease-in',
              isActiveTypeNewItem && itemDropIndex === index + 1
                ? 'opacity-100'
                : 'opacity-0',
            )}
          />
        )}
      </motion.div>
    );
  },
);
