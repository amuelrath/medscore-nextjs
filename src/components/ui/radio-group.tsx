"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/helpers/utils";
import { Label } from "@/components/ui/label";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  indicatorClassName?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item >,
  RadioGroupItemProps
>(({ className, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      asChild
      ref={ref}
      {...props}
    >
      <div className={cn(`cursor-pointer origin-center relative items-center space-x-2 transition-colors border w-full flex flex-row justify-start rounded-xl p-3 data-[state='checked']:border-neutral-200 data-[state='unchecked']:border-transparent`,
        className)}>
        <div
          className={
            "relative size-4 inset-0 origin-center rounded-full border border-accent-foreground bg-primary shadow-inner transition-all"
          }
        >
          <RadioGroupPrimitive.Indicator
            asChild
            forceMount
          >
            <div
              className={cn(
                'absolute inset-0  -left-[1px] mt-[0.1px] scale-100 size-4 origin-center rounded-full bg-card transition-all duration-300 ease-out data-[state="checked"]:scale-50  data-[state="unchecked"]:border data-[state="unchecked"]:border-neutral-500',
                props.disabled ? `hover:scale-100` : `hover:scale-75`,
                props.indicatorClassName
              )}
            />
          </RadioGroupPrimitive.Indicator>
        </div>
        <Label htmlFor={props.id} >{label}</Label>
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
