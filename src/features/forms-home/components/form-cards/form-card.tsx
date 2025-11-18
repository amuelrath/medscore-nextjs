'use client';

import { FormCardContextMenu } from '@/features/forms-home/components/form-cards/form-card-context-menu';
import { Card } from '@/components/ui/card';
import { TFormType } from '@/db/schema';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { DragOverlay, useDndContext, useDraggable } from '@dnd-kit/core';
import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import { ClockIcon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { FORM_TYPE_ICONS } from '@/features/forms-home/data/form-type-data';

const MotionCard = motion(Card);

export function FormCard({
  type,
  title,
  formId,
  lastOpenedAt,
}: {
  type: TFormType;
  title: string;
  formId: string;
  lastOpenedAt: Date;
}) {
  const router = useRouter();
  const Icon = FORM_TYPE_ICONS[type];

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `form-${formId}`,
    data: {
      title,
      type,
    },
  });

  // prevent event bubbling issues
  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/forms/${formId}`);
    },
    [router, formId],
  );

  return (
    <FormCardContextMenu formId={formId} title={title}>
      <MotionCard
        layout="position"
        layoutId={formId}
        animate={{
          scaleX: isDragging ? 0.95 : 1,
          scaleY: isDragging ? 0.2 : 1,
          opacity: isDragging ? 0 : 1,
        }}
        transition={{
          layout: { duration: 0.3, ease: 'circOut' },
          default: { duration: 0.1, ease: 'easeIn' },
        }}
        className={cn(
          'col-span-1 origin-top relative hover:border-accent-secondary transition-colors h-full pt-0.5 overflow-clip bg-teal-100',
        )}
        onClick={handleCardClick}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        aria-describedby={`form-card-${formId}`} // todo do i need this
      >
        <span className="absolute top-4 left-4" id={`form-card-${formId}`} />
        <div className="absolute text-nowrap flex font-medium text-sm select-none flex-col space-y-1 w-full p-2 z-20 h-14 aspect-square backdrop-opacity-20 backdrop-filter bg-card bottom-0">
          <div className="space-x-1.5 items-center flex flex-row">
            <Icon size={12} className="text-foreground" />
            <p className="">{truncate(title, 20)}</p>
          </div>
          <div className="flex items-center opacity-50 text-xs flex-row space-x-1.5">
            <ClockIcon size={12} />
            <span>
              {formatDistance(new Date(lastOpenedAt), new Date(), {
                addSuffix: true,
              })
                .replace(/\babout\s*/i, '')
                .trim()}
            </span>
          </div>
        </div>
      </MotionCard>
    </FormCardContextMenu>
  );
}

export function FormCardDragOverlay() {
  const { active } = useDndContext();

  if (!active) return null;

  const title = active.data.current?.title;
  const type = active.data.current?.type as TFormType;
  const Icon = FORM_TYPE_ICONS[type];

  return (
    <DragOverlay>
      <motion.div
        initial={{ scaleX: 1.05, scaleY: 1.1, opacity: 0 }}
        animate={{ scaleX: 1, scaleY: 1, opacity: 0.9 }}
        transition={{ ease: 'easeIn', duration: 0.15 }}
        className="relative select-none bg-card p-2 border border-accent-secondary flex space-x-1.5 flex-row items-center rounded shadow-lg opacity-90"
      >
        <Icon size={12} />
        <p className="text-sm font-medium">{truncate(title, 19)}</p>
        <span className="rounded-full bg-primary text-white absolute -top-2 -right-2 size-6 p-1 flex items-center justify-center">
          <PlusIcon size={12} />
        </span>
      </motion.div>
    </DragOverlay>
  );
}
