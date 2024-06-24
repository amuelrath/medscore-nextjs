"use client";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { v4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TFormRelate } from "@/db/types";
import { FC } from "react";
import { DataIntegrityAlert } from "@/components/(admin)/forms/editor/data-integrity-dialog";
import { useDataIntegrityDialog } from "@/components/(admin)/forms/editor/data-integrity-dialog/use-data-integrity-dialog";

interface OptionListProps {
  questionIndex: number;
}

export const OptionList: FC<OptionListProps> = ({ questionIndex }) => {
  const { control, register, getValues, setValue } =
    useFormContext<TFormRelate>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const isAdministered = true;

  const {
    showWarning,
    setShowWarning,
    pendingChange,
    handleValueChange,
    handleConfirmEdit,
    handleCancelEdit,
  } = useDataIntegrityDialog({
    isAdministered,
  });

  const handleAddOption = () => {
    append({
      id: v4(),
      questionId: getValues(`questions.${questionIndex}.id`),
      text: "",
      position: fields.length + 1,
      pointValue: "0",
    });
  };

  const handlePointValueChange = (
    index: number,
    newValue: string,
    oldValue: string,
  ) => {
    const shouldApply = handleValueChange(index, newValue, oldValue);
    if (shouldApply) {
      applyPointValueChange(index, newValue);
    }
  };

  const applyPointValueChange = (index: number, value: string) => {
    setValue(`questions.${questionIndex}.options.${index}.pointValue`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onConfirmEdit = () => {
    const result = handleConfirmEdit();
    if (result) {
      applyPointValueChange(result.index, result.newValue);
    }
  };

  const onCancelEdit = () => {
    handleCancelEdit();
    if (pendingChange) {
      applyPointValueChange(pendingChange.index, pendingChange.oldValue);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <AnimatePresence>
          {fields
            .sort((a, b) => a.position - b.position)
            .map((field, index) => (
              <motion.div
                key={field.id}
                layout
                className="flex items-center space-x-2"
              >
                <Input
                  {...register(
                    `questions.${questionIndex}.options.${index}.text`,
                  )}
                  placeholder="Option text"
                  className="flex-grow bg-blue-950 bg-opacity-5 p-2 shadow-inner backdrop-blur-3xl"
                />
                <Controller
                  name={`questions.${questionIndex}.options.${index}.pointValue`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Points"
                      className="w-20 bg-blue-950 bg-opacity-5 p-2 shadow-inner backdrop-blur-3xl"
                      onChange={(e) =>
                        handlePointValueChange(
                          index,
                          e.target.value,
                          field.value,
                        )
                      }
                    />
                  )}
                />
                <div className="rounded-full p-1 opacity-0 transition-all hover:bg-foreground hover:text-white group-hover:opacity-100">
                  <Trash2Icon size={16} onClick={() => remove(index)} />
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <PlusCircleIcon
            size={24}
            onClick={handleAddOption}
            className="cursor-pointer rounded-full p-1 opacity-0 transition-all hover:bg-foreground hover:text-white group-hover:opacity-100"
          />
          <div className="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Label
              htmlFor={`questions.${questionIndex}.feedback`}
              className="text-xs"
            >
              Require Feedback
            </Label>
            <Controller
              name={`questions.${questionIndex}.feedback`}
              control={control}
              render={({ field }) => (
                <Switch
                  size={"xs"}
                  id={`questions.${questionIndex}.feedback`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
      <DataIntegrityAlert
        showWarning={showWarning}
        setShowWarning={setShowWarning}
        handleCancelEdit={onCancelEdit}
        handleConfirmEdit={onConfirmEdit}
      />
    </>
  );
};
