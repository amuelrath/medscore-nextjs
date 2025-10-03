'use client';

import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchInput } from '@/components/ui/search-input';
import { getAllFormsLite } from '@/actions/forms/get-all-forms-lite';
import {
  UseMultiselectField,
  useMultiselectField,
} from '@/hooks/use-multiselect-field';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, PlusCircleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

export function FormMultiselect<T extends FieldValues>({
  name,
  disabled = false,
  control,
  defaultValue,
  max = 1,
}: UseMultiselectField<T>) {
  const { select, deselect, selectedIds } = useMultiselectField({
    name,
    disabled,
    control,
    defaultValue,
    max,
  });

  // get the forms
  const { data: forms } = useSuspenseQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const sortedItems = useMemo(
    () =>
      [...forms]
        .filter((f) => f.type !== 'DIRECT_OBSERVATION')
        .sort((a, b) => {
          if (a.id === (selectedIds.at(0) || '')) return -1;
          if (b.id === (selectedIds.at(0) || '')) return 1;
          return 0;
        }),
    [forms, selectedIds],
  );

  return (
    <Popover modal>
      <PopoverTrigger asChild disabled={disabled}>
        <motion.div
          role="button"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 0.98 }}
          className={cn(
            'w-[156px] h-[90px] relative overflow-hidden',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <div
            className={cn(
              'absolute transition inset-0 flex items-center justify-center',
              selectedIds.length > 0 && 'hidden',
            )}
          >
            <div className="w-full h-full flex flex-col items-center justify-center hover:border-foreground/50 border transition group border-foreground/30 rounded-md">
              <PlusCircleIcon
                className={cn(
                  'text-foreground/30 group-hover:text-foreground/50 transition',
                  selectedIds.length > 0 && 'opacity-0',
                )}
                strokeWidth={1.25}
              />
            </div>
          </div>
          {selectedIds.length > 0 && (
            <div className="absolute w-full">
              <CompactFormCard
                displayOnly
                title={forms.find((f) => f.id === selectedIds[0])?.title || ''}
              />
            </div>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="left"
        className={cn(
          'flex flex-col w-[350px] overflow-hidden h-[350px] max-h-[80vh]',
        )}
      >
        <div
          aria-label="search-and-filters"
          className="flex-shrink-0 flex -mt-4 flex-row items-center justify-between h-[45px]"
        >
          <SearchInput placeholder="Search forms..." size="xs" />
        </div>
        <div className="relative -mt-1 flex-grow overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-10" />
          <div className="grid grid-cols-2 auto-rows-[90px] gap-3 h-full p-2 overflow-y-auto no-scrollbar">
            <AnimatePresence>
              {sortedItems.map((f) => (
                <CompactFormCard
                  key={f.id}
                  title={f.title}
                  select={() => select(f.id)}
                  deselect={() => deselect(f.id)}
                  isSelected={selectedIds.includes(f.id)}
                  disabled={disabled}
                  isMaxReached={selectedIds.length >= max}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CompactFormCardProps {
  title: string;
  isSelected?: boolean;
  select?: () => void;
  deselect?: () => void;
  disabled?: boolean;
  isMaxReached?: boolean;
  displayOnly?: boolean;
}

const MotionCard = motion(Card);

function CompactFormCard({
  title,
  isSelected,
  select,
  deselect,
  disabled = false,
  isMaxReached,
  displayOnly = false,
}: CompactFormCardProps) {
  const handleClick = () => {
    if (displayOnly) return;
    if (isSelected) {
      if (!disabled) {
        deselect?.();
      }
    } else if (!disabled) {
      select?.();
    }
  };

  return (
    <MotionCard
      layout="position"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 0.98 }}
      aria-disabled={disabled && isSelected}
      onClick={handleClick}
      className={cn(
        'relative h-[90px] pt-0.5 overflow-clip',
        !displayOnly && 'cursor-pointer',
        disabled && isSelected && 'opacity-50 cursor-not-allowed',
        'bg-accent-secondary/30',
        !isSelected && isMaxReached && 'opacity-50',
      )}
    >
      <span className="absolute flex origin-center font-medium select-none flex-row items-center justify-between w-full p-2 text-xs z-20 h-2/5 backdrop-opacity-20 backdrop-filter bg-card bottom-0">
        <p>{truncate(title, 21)}</p>
        <AnimatePresence>
          {isSelected && !displayOnly && (
            <motion.span
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{ duration: 0.2, ease: 'circInOut' }}
            >
              <CheckCircle2Icon className="text-accent-secondary" size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </MotionCard>
  );
}
