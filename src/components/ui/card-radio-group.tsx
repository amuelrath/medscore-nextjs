'use client';

import { cn } from '@/lib/helpers/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { ReactNode } from 'react';

// Types & Interfaces
interface CardRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  orientation?: 'vertical' | 'horizontal';
}

interface CardRadioItemIconProps {
  children: LucideIcon;
}

interface CardRadioItemLabelProps {
  children: ReactNode;
}

interface CardRadioItemDescriptionProps {
  children: ReactNode;
}

interface CardRadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  children?: ReactNode;
}

// Main Components
const CardRadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>,
  CardRadioGroupProps >
    (({ className, orientation, ...props }, ref) => (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(
          'w-full',
          orientation === 'vertical'
            ? 'flex flex-col space-y-2'
            : 'flex flex-row space-x-2',
          className,
        )}
        {...props}
      />
    ));

const CardRadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>,
  CardRadioGroupItemProps >
    (({ className = '', children, ...props }, ref) => {
      const childrenArray = React.Children.toArray(children);

      const icon = childrenArray.find(
        (child) =>
          React.isValidElement(child) && child.type === CardRadioItemIcon,
      );

      const label = childrenArray.find(
        (child) =>
          React.isValidElement(child) && child.type === CardRadioItemLabel,
      );

      const description = childrenArray.find(
        (child) =>
          React.isValidElement(child) &&
          child.type === CardRadioItemDescription,
      );

      const otherElements = childrenArray.filter(
        (child) =>
          React.isValidElement(child) &&
          ![
            CardRadioItemIcon,
            CardRadioItemLabel,
            CardRadioItemDescription,
          ].includes(child.type as any),
      );

      return (
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(
            'flex-1 rounded-md select-none border cursor-pointer shadow-sm p-3 flex flex-col space-y-2 transition-all',
            'data-[state=checked]:bg-primary/[.03] data-[state=checked]:ring data-[state=checked]:ring-primary data-[state=checked]:ring-offset-2',
            className,
          )}
          {...props}
        >
          <div className="flex flex-row items-center space-x-3">
            {icon}
            {label}
          </div>
          {description}
          {otherElements}
        </RadioGroupPrimitive.Item>
      );
    });

// Sub Components
function CardRadioItemIcon({ children: Icon }: CardRadioItemIconProps) {
  return (
    <span className="p-1.5 rounded-full bg-primary/10">
      <Icon size={16} className="text-foreground" />
    </span>
  );
}

function CardRadioItemLabel({ children }: CardRadioItemLabelProps) {
  return <p className="text-sm font-semibold">{children}</p>;
}

function CardRadioItemDescription({ children }: CardRadioItemDescriptionProps) {
  return <p className="text-xs text-left text-neutral-400">{children}</p>;
}


// Exports
export {
  CardRadioGroup,
  CardRadioGroupItem,
  CardRadioItemDescription,
  CardRadioItemIcon,
  CardRadioItemLabel,
};
