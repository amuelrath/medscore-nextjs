'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import React from 'react';

const MotionCheckIcon = motion(CheckIcon);

interface StepProps {
  index: number;
  label: string;
  completed: boolean;
  active: boolean;
}

function Step({ index, label, completed, active }: StepProps) {
  return (
    <div className={cn('flex flex-row items-center space-x-2 select-none')}>
      <span
        className={cn(
          'rounded-full border border-accent-secondary/50 size-6 transition flex justify-center items-center',
          completed &&
            'text-white bg-accent-secondary/70 border-accent-secondary/50',
          active && 'text-white bg-accent-secondary',
        )}
      >
        {completed ? (
          <MotionCheckIcon
            size={12}
            strokeWidth={3}
            initial={{ scale: 0, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
          />
        ) : (
          <motion.span
            initial={{ scale: 0, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="text-xs font-semibold"
          >
            {index + 1}
          </motion.span>
        )}
      </span>
      <span
        className={cn(
          'text-xs font-medium transition',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface ProgressStepsProps {
  stepLabels: string[];
  currentStepIndex: number;
}

export function ProgressSteps({
  stepLabels,
  currentStepIndex,
}: ProgressStepsProps) {
  return (
    <div className="flex flex-row items-center">
      {stepLabels.map((label, index) => (
        <React.Fragment key={label}>
          <Step
            index={index}
            label={label}
            completed={index < currentStepIndex}
            active={index === currentStepIndex}
          />
          {index !== stepLabels.length - 1 && (
            <span className="mx-2 block w-8 h-px bg-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
