import React, { useRef, useEffect, useState, useCallback } from "react";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { Control, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyIcon, MilestoneIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, m } from "framer-motion";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";
import { AutosizeTextarea } from "@/components/ui/autosize-text-area";
import { MilestoneBadges } from "@/components/(admin)/forms/editor/milestone-badges";
import { TFormItemType } from "@/db/schema";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { AddFormItemDock } from "@/components/(admin)/forms/editor/add-form-item-dock";
import { FormItemSettingsPopover } from "@/components/(admin)/forms/editor/form-item-settings-popover";

const placeholders = {
  HEADER: "Header",
  MULTIPLE_CHOICE: "Question",
  SINGLE_CHOICE: "Question",
  WRITTEN: "Question",
  RANGE: "Question",
} as const;

const content = {
  HEADER: HeaderItemContent,
  MULTIPLE_CHOICE: MultipleChoiceItemContent,
  SINGLE_CHOICE: SingleChoiceItemContent,
  WRITTEN: WrittenItemContent,
  RANGE: RangeItemContent,
} as const;

interface FormItemWrapperProps {
  item: TFormSchema["formItems"][number];
  control: Control<TFormSchema>;
  index: number;
  removeItem: () => void;
  duplicateItem: () => void;
  isSelected: boolean;
  selectItem: (index: number, top: number, height: number) => void;
  deselectItem: () => void;
  toggleMilestoneDialog: () => void;
}

export function FormItem({
  item,
  index,
  control,
  isSelected,
  selectItem,
  removeItem,
  duplicateItem,
  toggleMilestoneDialog,
}: FormItemWrapperProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (itemRef.current) {
      const { offsetTop, offsetHeight } = itemRef.current;
      selectItem(index, offsetTop, offsetHeight);
    }
  }, [index, selectItem]);

  useEffect(() => {
    if (isSelected) {
      // Delay the position update slightly to ensure layout has settled
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(updatePosition);
      }, 100); // since the 100ms transition of border-t is causing the height to change
      return () => clearTimeout(timeoutId);
    }
  }, [isSelected, updatePosition]);

  const handleFocus = () => {
    updatePosition();
  };


  const getContent = () => {
    const ContentComponent = content[item.type];
    return (
      <ContentComponent
        index={index}
        control={control}
        key={item.id}
        isSelected={isSelected}
      />
    );
  };

  return (
    <div ref={itemRef} className="relative mb-4">
      <Card
        onClick={handleFocus}
        className={cn(
          item.type === "HEADER" && "border-t-[12px] border-t-primary/80",
          isSelected &&
            item.type !== "HEADER" &&
            "border-t-[6px] border-t-accent-secondary",
          "overflow-hidden transition-all",
        )}
      >
        <CardHeader className="flex flex-row items-start">
          <div
            className="flex-grow"
            style={{
              width:
                isSelected && item.type !== "HEADER"
                  ? "calc(100% - 45px)"
                  : "100%",
            }}
          >
            <Controller
              name={`formItems.${index}.text`}
              control={control}
              render={({ field }) => (
                <AutosizeTextarea
                  {...field}
                  minHeight={30}
                  rows={1}
                  placeholder={placeholders[item.type]}
                  className={cn(
                    item.type === "HEADER" && "text-xl font-semibold",
                    "w-full",
                  )}
                />
              )}
            />
          </div>
          <AnimatePresence>
            {(item.type === "HEADER" || isSelected) && (
              <m.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="ml-2 flex flex-row items-center overflow-hidden pr-1"
              >
                {item.type !== "HEADER" && (
                  <FormItemSettingsPopover
                    index={index}
                    type={item.type}
                    control={control}
                  />
                )}
                <SimpleTooltip
                  description={"Copy"}
                  delay={200}
                  contentClassName=" w-[60px] "
                >
                  <Button
                    size="xs"
                    variant="hide"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateItem();
                    }}
                  >
                    <CopyIcon
                      className="text-neutral-500 hover:text-neutral-500/80"
                      size={16}
                    />
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip
                  description={"Delete"}
                  delay={200}
                  contentClassName=" w-[65px] "
                >
                  <Button
                    size="xs"
                    variant="hide"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem();
                    }}
                  >
                    <TrashIcon
                      className="text-neutral-500 hover:text-destructive"
                      size={16}
                    />
                  </Button>
                </SimpleTooltip>
              </m.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent>
          {getContent()}
          {item.type !== "HEADER" && (
            <div className="mt-2 flex select-none flex-row items-center justify-end">
              <MilestoneBadges questionIndex={index} />
              <MilestoneIcon
                size={16}
                onClick={toggleMilestoneDialog}
                className="ml-2 cursor-pointer text-neutral-500 transition-colors hover:text-accent-secondary"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface FormItemContentProps {
  index: number;
  isSelected: boolean;
  control: Control<TFormSchema>;
}

function HeaderItemContent({ index, control }: FormItemContentProps) {
  return (
    <Controller
      name={`formItems.${index}.description`}
      control={control}
      render={({ field }) => (
        // @ts-expect-error
        <AutosizeTextarea {...field} placeholder="Description" />
      )}
    />
  );
}

function MultipleChoiceItemContent({
  index,
  isSelected,
}: FormItemContentProps) {
  return <OptionList isMulti itemIndex={index} isSelected={isSelected} />;
}

function SingleChoiceItemContent({ index, isSelected }: FormItemContentProps) {
  return <OptionList itemIndex={index} isSelected={isSelected} />;
}

function WrittenItemContent({}: FormItemContentProps) {
  return (
    <div className="mb-4 select-none space-y-8">
      <div className="border-b-2 border-dotted border-neutral-300 text-sm text-neutral-300">
        Written response
      </div>
      <div className="border-b-2 border-dotted border-neutral-300" />
    </div>
  );
}

function RangeItemContent({}: FormItemContentProps) {
  return <div>this doesnt exist yet</div>;
}
