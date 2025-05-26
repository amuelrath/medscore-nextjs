'use client';

import { DeleteFormDialogTrigger } from '@/components/(admin)/forms/home/modals/delete-evaluation-dialog';
import { RenameFormDialogTrigger } from '@/components/(admin)/forms/home/modals/rename-form-dialog';
import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { TFormType } from '@/db/schema';
import { formTypeContent } from '@/lib/constants/forms';
import { truncate } from '@/lib/helpers/truncate';
import { cn } from '@/lib/helpers/utils';
import { DragOverlay, useDndContext, useDraggable } from '@dnd-kit/core';
import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  ExternalLinkIcon,
  TextCursorIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useCallback } from 'react';

const MotionCard = motion(Card);

export function FormCard({
  type,
  title,
  id,
  lastOpenedAt,
}: {
  type: TFormType;
  title: string;
  id: string;
  lastOpenedAt: Date;
}) {
  const router = useRouter();
  const Icon = formTypeContent[type];

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `form-${id}`,
    data: {
      title,
      type,
    },
  });

  // Separate the click handler to prevent event bubbling issues
  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/forms/${id}`);
    },
    [router, id],
  );

  return (
    <FormCardContextMenu id={id} title={title}>
      <MotionCard
        layout="position"
        layoutId={id}
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
        // Add a stable aria-describedby to prevent hydration mismatch
        aria-describedby={`form-card-${id}`}
      >
        <span className="absolute top-4 left-4" id={`form-card-${id}`} />
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

function FormCardContextMenu({
  id,
  title,
  children,
  asChild = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  asChild?: boolean;
}) {

  // Handler for opening in new tab
  const handleOpenInNewTab = useCallback(() => {
    window.open(`/forms/${id}`, '_blank');
  }, [id]);

  return (
    <ContextMenu modal={false} >
      <ContextMenuTrigger  asChild={asChild}>{children}</ContextMenuTrigger>
      <ContextMenuContent >
        <DeleteFormDialogTrigger title={title} id={id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Remove
            <ContextMenuShortcut>
              <TrashIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </DeleteFormDialogTrigger>
        <RenameFormDialogTrigger formId={id} currentTitle={title}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Rename
            <ContextMenuShortcut>
              <TextCursorIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </RenameFormDialogTrigger>
        <ContextMenuItem onSelect={handleOpenInNewTab}>
          Open in new tab
          <ContextMenuShortcut>
            <ExternalLinkIcon size={12} />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FormCardDragOverlay() {
  const { active } = useDndContext();

  if (!active) return null;

  const title = active.data.current?.title;
  const type = active.data.current?.type as TFormType;
  const Icon = formTypeContent[type];

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
          +
        </span>
      </motion.div>
    </DragOverlay>
  );
}
