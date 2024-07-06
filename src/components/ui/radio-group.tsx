"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/helpers/utils";
import { Label } from "@/components/ui/label";
import { useId } from "react";

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
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item >,
  RadioGroupItemProps
>(({ className, label, ...props }, ref) => {
  const id = useId()
  return (
    <RadioGroupPrimitive.Item
      asChild
      ref={ref}
      {...props}
    >
      <div className={cn(`cursor-pointer relative items-center space-x-2 transition-colors border-2 w-full flex flex-row justify-start rounded-xl p-3 data-[state='checked']:border-accent-secondary data-[state='unchecked']:border-transparent`,
        className)}>
        <div
          className={
            "relative aspect-square size-4 origin-center rounded-full border border-accent-foreground bg-accent-secondary shadow-inner transition-all"
          }
        >
          <RadioGroupPrimitive.Indicator
            asChild
            forceMount
          >
            <div
              className={cn(
                'absolute -left-[0.5px] -top-[0.5px] size-4 origin-center rounded-full bg-blue-950/50 data-[state="checked"]:bg-teal-900 transition-all duration-300 ease-out data-[state="checked"]:scale-50',
                props.disabled ? `hover:scale-100` : `hover:scale-75`,
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
