import { FormItemSettingsPopover } from "@/components/(admin)/forms/editor/form-item-settings-popover";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { MilestoneBadges } from "@/components/(admin)/forms/editor/milestone-badges";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";
import { formTypeColors } from "@/components/(admin)/forms/home/create-form-dialog";
import { AutosizeTextarea } from "@/components/ui/autosize-text-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { TFormType } from "@/db/schema";
import { cn } from "@/lib/helpers/utils";
import { m } from "framer-motion";
import { CopyIcon, MilestoneIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Control, Controller } from "react-hook-form";

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
  const formType = control._defaultValues.type;

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

  const getContent = () => {
    const ContentComponent = content[item.type];
    return (
      <ContentComponent
        id={item.id}
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
        onMouseDown={() => updatePosition()}
        className={cn(
          "relative z-10 origin-center overflow-hidden transition-all",
        )}
      >
        <m.span
          initial={false}
          animate={{
            width: isSelected ? "100%" : "0%",
            height:  "6px",
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "absolute -top-[3px] left-0 right-0 z-10 origin-center",
               formTypeColors[formType as TFormType].border,
          )}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <CardHeader className="flex flex-row items-start">
          <div
            className="flex-grow"
            style={{
              width:
                isSelected
                  ? "calc(100% - 45px)"
                  : "100%",
            }}
          >
            <Controller
              name={`formItems.${index}.text`}
              control={control}
              render={({ field }) => (
                // @ts-expect-error
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
          {( isSelected) && (
            <m.div
              layoutId={`settings-group-${item.id}`}
              layout="position"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="ml-2 flex flex-row items-center will-change-auto overflow-hidden pr-1"
            >
              {item.type !== "HEADER" && (
                <FormItemSettingsPopover
                  index={index}
                  type={item.type}
                  control={control}
                />
              )}
              <EnhancedTooltip
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
              </EnhancedTooltip>
              <EnhancedTooltip
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
              </EnhancedTooltip>
            </m.div>
          )}
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
  id: string;
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
  id,
}: FormItemContentProps) {
  return (
    <OptionList isMulti key={id} itemIndex={index} isSelected={isSelected} />
  );
}

function SingleChoiceItemContent({
  index,
  isSelected,
  id,
}: FormItemContentProps) {
  return <OptionList key={id} itemIndex={index} isSelected={isSelected} />;
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
