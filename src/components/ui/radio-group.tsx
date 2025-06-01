'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@/lib/helpers/utils';
import { ReactNode } from 'react';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('grid gap-2', className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  children?: ReactNode;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className = '', children, ...props }, ref) => (
  <label className="w-full flex flex-row py-1 space-x-4 items-center cursor-pointer">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'size-4 rounded-full border-2 border-foreground text-foreground shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'relative before:content-[""] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:w-2 before:h-2 before:bg-foreground before:scale-0 before:transition-transform',
        '[&[data-state=checked]]:before:scale-100',
        'after:content-[""] after:absolute after:inset-0 after:rounded-full after:border after:transition-colors',
        '[&[data-state=checked]]:after:border-transparent [&[data-state=unchecked]]:after:border-transparent',
        className,
      )}
      {...props}
    />
    {children}
  </label>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
