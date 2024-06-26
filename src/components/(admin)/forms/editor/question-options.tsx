"use client";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { v4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FC } from "react";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";

interface OptionListProps {
  questionIndex: number;
}

export const OptionList: FC<OptionListProps> = ({ questionIndex }) => {
  const { control, register } = useFormContext<TFormSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleAddOption = () => {
    const position = fields.length + 1;
    append({
      id: v4(),
      text: "",
      position,
      pointValue: "0",
    });
  };

  return (
    <>
      <div className="space-y-2">
        {fields
          .sort((a, b) => a.position - b.position)
          .map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                {...register(
                  `questions.${questionIndex}.options.${index}.text`,
                )}
                placeholder="Option"
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
                    className="w-14 bg-blue-950 bg-opacity-5 p-2 text-center shadow-inner backdrop-blur-3xl"
                  />
                )}
              />
              <div className="p-1 opacity-0 transition-all hover:text-destructive/90 group-hover:opacity-100">
                <Trash2Icon size={16} onClick={() => remove(index)} />
              </div>
            </div>
          ))}
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
    </>
  );
};
