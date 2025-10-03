'use client';

// BEWARE of hacky animation code

import {
  NewFormItemProps,
  TFormItemSchema,
} from '@/features/form-builder/types';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { LucideProps, PlusIcon } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';

import { NEW_FORM_ITEMS } from '@/features/form-builder/data/default-settings-data';

export function NewFormItem({ itemType, label, Icon }: NewFormItemProps) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id: `new-item-${itemType}`,
    data: {
      itemType,
    },
  });

  return (
    <motion.div
      whileHover={{ scale: 0.9 }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'flex flex-col border origin-center ease-out transition hover:border-accent-secondary/80 border-border bg-white items-center justify-center rounded-md h-24',
        isDragging ? 'opacity-30' : 'opacity-100',
      )}
    >
      <Icon className="opacity-40 origin-center size-8 mb-2" />
      <span className={cn('text-xs text-center')}>{label}</span>
    </motion.div>
  );
}

export function NewFormItemOverlay({
  Icon,
}: {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative origin-center bg-card border border-accent-secondary select-none flex items-center justify-center drop-shadow-xl"
      initial={{
        scale: 0.9,
        borderRadius: '5%',
        width: '6rem',
        height: '6rem',
        opacity: 0.7,
      }}
      animate={
        isHovered
          ? {
              borderRadius: '50%',
              width: '3.5rem',
              height: '3.5rem',
              opacity: 0.8,
            }
          : {
              borderRadius: '5%',
              width: '6rem',
              height: '6rem',
              opacity: 0.6,
            }
      }
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerUp={() => setIsHovered(false)}
    >
      <motion.span
        animate={{ y: isHovered ? 0 : -9.5 }}
        transition={{ duration: 0.1 }}
      >
        <Icon className={cn('opacity-60 origin-center size-8')} />
      </motion.span>
      <motion.span
        initial={{ scale: 0 }}
        animate={isHovered ? { scale: 1 } : { opacity: 0 }}
        className="rounded-full origin-center bg-primary text-white absolute -top-1.5 -right-1.5 size-6 p-1 flex items-center justify-center"
      >
        <PlusIcon size={12} />
      </motion.span>
    </motion.div>
  );
}

function SidebarSection({
  itemTypes,
  label,
}: {
  itemTypes: TFormItemSchema['type'][];
  label: string;
}) {
  return (
    <div className="col-span-3 space-y-2">
      <hr />
      <div className="grid grid-cols-3 gap-4 px-4">
        <p className="text-sm font-medium col-span-full">{label}</p>
        {NEW_FORM_ITEMS.filter((i) => itemTypes.includes(i.itemType)).map(
          (props) => (
            <NewFormItem key={props.label} {...props} />
          ),
        )}
      </div>
    </div>
  );
}

export function SidebarFormItemList() {
  return (
    <>
      <SidebarSection
        key="layout"
        label="Layout"
        itemTypes={['HEADER', 'PARAGRAPH']}
      />
      <SidebarSection
        key="input"
        label="Input"
        itemTypes={['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'WRITTEN']}
      />
    </>
  );
}
