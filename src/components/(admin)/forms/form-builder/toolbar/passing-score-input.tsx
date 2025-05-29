'use client'

import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { cn } from '@/lib/helpers/utils';

interface PassingScoreInputProps extends React.ComponentPropsWithRef<typeof Input> {}

const PassingScoreInput = React.forwardRef<HTMLInputElement, PassingScoreInputProps>(
  ({ className, value: propValue, onChange: propOnChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(propValue?.toString() || '0');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const numericValue = Number(newValue);

      if (!Number.isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
        setInternalValue(newValue);
        propOnChange?.(e);
      } else if (newValue === '') {
        setInternalValue('0');
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: '0' }
        };
        propOnChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <Input
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        format={(val) => `>${Math.fround(Number(val))}%`}
        size="xs"
        className={cn('w-16 border shadow-inner bg-white/15 border-white text-center rounded-md text-sm', className)}
        variant="outline"
        min={0}
        max={100}
        {...props}
      />
    );
  }
);

PassingScoreInput.displayName = 'PassingScoreInput';

export { PassingScoreInput };