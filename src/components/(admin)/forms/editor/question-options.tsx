"use client";
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch,
} from "react-hook-form";
import { CircleIcon, SquareIcon, XIcon } from "lucide-react";
import { v4 } from "uuid";
import { Input } from "@/components/ui/input";
import { FC } from "react";
import { m } from "framer-motion";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { cn } from "@/lib/helpers/utils";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";

interface OptionListProps {
  itemIndex: number;
  isMulti?: boolean;
  isSelected: boolean;
}

export const OptionList: FC<OptionListProps> = ({
  itemIndex,
  isMulti,
  isSelected,
}) => {
  const { control, register } = useFormContext<TFormSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `formItems.${itemIndex}.options`,
  });

  const isScored = useWatch({
    control,
    name: `formItems.${itemIndex}.isScored`,
  });

  const handleAddOption = (isNa = false) => {
    const position = fields.length + 1;
    append({
      id: v4(),
      text: isNa ? "N/a" : "",
      position,
      pointValue: isNa ? undefined : isScored ? "0" : undefined,
      isNa,
    });
  };

  return (
    <div>
      {fields
        .sort((a, b) => a.position - b.position)
        .map((field, index) => (
          <div key={field.id} className="mb-2 flex items-center">
            {isMulti ? (
              <SquareIcon
                strokeWidth={2}
                className="flex-shrink-0 text-neutral-500"
                size={18}
              />
            ) : (
              <CircleIcon
                strokeWidth={2}
                className="flex-shrink-0 text-neutral-500"
                size={18}
              />
            )}
            <div className="relative mx-2 flex-grow">
              <Input
                {...register(`formItems.${itemIndex}.options.${index}.text`)}
                disabled={field.isNa}
                placeholder={field.isNa ? "Not Applicable" : "Option"}
                size="sm"
                className="w-full"
              />
            </div>
            <m.div
              initial={{ width: 0 }}
              animate={{
                width:
                  isSelected && isScored && !field.isNa
                    ? "calc(65px + 24px)"
                    : isSelected
                      ? "24px"
                      : "0px",
              }}
              transition={{ duration: 0.1 }}
              className="flex items-center will-change-auto overflow-hidden"
            >
              {!field.isNa && isScored && (
                <Controller
                  name={`formItems.${itemIndex}.options.${index}.pointValue`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      size="sm"
                      className="mr-2 w-14 text-center font-light"
                      placeholder="Points"
                    />
                  )}
                />
              )}
              <EnhancedTooltip
                description={"Delete"}
                delay={200}
                contentClassName="absolute right-0 w-[65px]"
              >
                <div className="cursor-pointer p-1 text-neutral-500 hover:text-destructive/90">
                  <XIcon size={16} onClick={() => remove(index)} />
                </div>
              </EnhancedTooltip>
            </m.div>
          </div>
        ))}
      <m.div
        initial={{ x: -50, opacity: 0 }}
        animate={{
          x: isSelected ? 0 : -50,
          opacity: isSelected ? 1 : 0,
          height: isSelected ? "32px" : "0px",
        }}
        transition={{ duration: 0.1 }}
        className={cn("flex h-8 select-none items-center will-change-transform space-x-3")}
      >
        {isMulti ? (
          <SquareIcon strokeWidth={2} className="text-neutral-500" size={18} />
        ) : (
          <CircleIcon strokeWidth={2} className="text-neutral-500" size={18} />
        )}
        <div className="flex flex-row items-center space-x-1 text-xs text-neutral-500">
          <p
            onClick={() => handleAddOption()}
            className="cursor-pointer hover:underline"
          >
            Add Option
          </p>
          {!fields.find((f) => f.isNa) && (
            <>
              <p>or</p>
              <p
                className="cursor-pointer italic hover:underline"
                onClick={() => handleAddOption(true)}
              >
                Not Applicable
              </p>
            </>
          )}
        </div>
      </m.div>
    </div>
  );
};
