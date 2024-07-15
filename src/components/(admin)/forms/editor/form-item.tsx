import React from "react";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { Control, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckCheckIcon,
  CheckIcon,
  CopyIcon,
  HeadingIcon,
  NotebookPenIcon,
  TrashIcon,
  WrenchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, m } from "framer-motion";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";
import { AutosizeTextarea } from "@/components/ui/autosize-text-area";
import { MilestoneBadges } from "@/components/(admin)/forms/editor/milestone-badges";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TFormItemType } from "@/db/schema";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface FormItemWrapperProps {
  item: TFormSchema["formItems"][number];
  control: Control<TFormSchema>;
  index: number;
  removeItem: () => void;
  duplicateItem: () => void;
  isSelected: boolean;
  selectItem: () => void;
  deselectItem: () => void;
}

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
  showDock: boolean;
  isSelected: boolean;
  selectItem: () => void;
  addQuestion: (type: TFormItemType) => void;
}

export function FormItem({
  item,
  index,
  control,
  isSelected,
  showDock,
  selectItem,
  removeItem,
  duplicateItem,
  addQuestion,
}: FormItemWrapperProps) {
  const handleFocus = () => {
    selectItem();
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
    <div className="relative">
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
            className="flex-grow transition-all duration-300 ease-in-out"
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
                className="ml-2 flex flex-row items-center overflow-hidden"
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
            </div>
          )}
        </CardContent>
      </Card>
      <AnimatePresence>
        {showDock && (
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full top-0 ml-4"
          >
            <AddFormItemDock addQuestion={addQuestion} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddFormItemDock({
  addQuestion,
}: {
  addQuestion: (type: TFormItemType) => void;
}) {
  return (
    <m.div
      layout="position"
      layoutId="dock"
      className="flex flex-col items-center space-y-2 rounded-lg border border-neutral-300 bg-card p-4 drop-shadow-xl"
    >
      <SimpleTooltip
        description={"Single-choice"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[112px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("SINGLE_CHOICE")}
        >
          <CheckIcon size={16} />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip
        description={"Multiple-choice"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[120px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("MULTIPLE_CHOICE")}
        >
          <CheckCheckIcon size={16} />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip
        description={"Written"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[70px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("WRITTEN")}
        >
          <NotebookPenIcon size={16} />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip
        description={"Heading"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[80px] "
      >
        <Button variant="ghost" size="xs" onClick={() => addQuestion("HEADER")}>
          <HeadingIcon size={16} />
        </Button>
      </SimpleTooltip>
    </m.div>
  );
}
interface FormItemSettingsPopoverProps {
  index: number;
  type: TFormItemType;
  control: Control<TFormSchema>;
}

function FormItemSettingsPopover({
  index,
  control,
  type,
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
