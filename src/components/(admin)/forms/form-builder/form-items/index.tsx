import {
  TestItem,
  useFormBuilderStore,
} from '@/components/(admin)/forms/form-builder/store';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/helpers/utils';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { CopyIcon, GripVerticalIcon, XIcon } from 'lucide-react';
import React, { useRef } from 'react';

interface FormItemProps {
  item: TestItem;
  index: number;
  isClone: boolean;
}

function animateLayoutChanges(args: any) {
  const { isSorting, wasSorting } = args;

  if (isSorting || wasSorting) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

export const FormItem = React.memo(
  ({ item, index, isClone }: FormItemProps) => {
    const { removeItem, itemDropIndex } = useFormBuilderStore();
    const length = useFormBuilderStore((state) => state.items.length);
    const itemRef = useRef<HTMLDivElement>(null);

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
      id: item.id,
      data: {
        type: 'item',
      },
      animateLayoutChanges,
    });

    const isActiveTypeNewItem =
      active && active.data.current?.type === 'new-item';

    // if we are are dragging a new item, we dont want to transform
    const style = {
      transform: isActiveTypeNewItem
        ? undefined
        : CSS.Translate.toString(transform),
      transition,
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      removeItem(item.id);
    };

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      // onCopyClick();
    };

    const position = index + 1;

    return (
      <motion.div
        initial={{ y: isClone ? 0 : -10, opacity: isClone ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn('flex origin-center flex-col')}
      >
        {!isClone && (
          <span
            className={cn(
              'h-1 mb-2 bg-accent-secondary/40 w-full rounded-full',
              isActiveTypeNewItem && itemDropIndex === index
                ? 'opacity-100'
                : 'opacity-0',
            )}
          />
        )}
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'flex bg-white flex-row rounded border shadow-sm mb-2',
            isDragging && 'opacity-0',
          )}
        >
          <div className="flex flex-col p-1 justify-start items-center cursor-grab">
            <GripVerticalIcon
              {...listeners}
              {...attributes}
              role="button"
              size={20}
              className="text-primary/40 hover:text-primary/70 transition-colors"
            />
          </div>
          <div className="space-y-2  select-none flex-grow pr-7 pl-0.5">
            <div className="w-full h-6 flex flex-row justify-between">
              <div className="flex flex-row space-x-4">
                <span className="text-white flex items-center justify-center text-sm w-8 rounded-b bg-primary/60">
                  {position}
                </span>
              </div>
              <div className="flex text-center justify-center px-4 rounded-b bg-primary/60 space-x-4 items-center">
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
            <CardContent className="flex-grow pb-2 px-0" ref={itemRef}>
              {item.text}
            </CardContent>
          </div>
        </div>
        {!isClone && index === length - 1 && (
          <span
            className={cn(
              'h-1 bg-accent-secondary/40 w-full rounded-full',
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
