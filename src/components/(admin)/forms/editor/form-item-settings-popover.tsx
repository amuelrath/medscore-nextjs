import { TFormItemType } from "@/db/schema";
import { Control, Controller } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Button } from "@/components/ui/button";
import { WrenchIcon } from "lucide-react";
import { cn } from "@/lib/helpers/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React from "react";

interface FormItemSettingsPopoverProps {
  index: number;
  type: TFormItemType;
  control: Control<TFormSchema>;
}

export function FormItemSettingsPopover({
                                          index,
                                          control,
                                          type
                                        }: FormItemSettingsPopoverProps) {
  return (
    <Popover>
      <SimpleTooltip
        description={"Settings"}
        delay={200}
        contentClassName=" w-[75px] "
      >
        <PopoverTrigger asChild>
          <Button variant="hide" size="xs">
            <WrenchIcon size={16} className="text-neutral-500" />
          </Button>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className={cn("flex max-w-32 flex-col space-y-2")}>
        <div className="flex flex-row items-center space-x-2">
          <Controller
            name={`formItems.${index}.isRequired`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                id={`formItems.${index}.isRequired`}
                size="xs"
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
          <Label
            htmlFor={`formItems.${index}.isRequired`}
            className="text-xs text-neutral-500"
          >
            Required
          </Label>
        </div>
        {type !== "WRITTEN" && (
          <div className="flex flex-row items-center space-x-2">
            <Controller
              name={`formItems.${index}.isScored`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  id={`formItems.${index}.isScored`}
                  size="xs"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label
              htmlFor={`formItems.${index}.isRequired`}
              className="text-xs text-neutral-500"
            >
              Scored
            </Label>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}