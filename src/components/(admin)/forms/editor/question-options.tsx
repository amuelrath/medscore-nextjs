"use client";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { TFormRelate } from "@/db/types";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Option({ nestIndex }: { nestIndex: number }) {
  const { control, register, getValues } = useFormContext<TFormRelate>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fields.length]);

  return (
    <>
      <AnimatePresence>
        <div className={cn("space-y-2")}>
          {fields
            .sort((a, b) => a.position - b.position)
            .map((item, k) => (
              <motion.div
                key={`option-${item.id}`}
                layout="position"
                layoutId={`option-${item.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("group flex w-full items-center space-x-2")}
              >
                <Input
                  {...register(`questions.${nestIndex}.options.${k}.text`)}
                  className={cn("rounded-md border p-2")}
                  placeholder={"Option"}
                />
                <Input
                  placeholder="Points"
                  {...register(
                    `questions.${nestIndex}.options.${k}.pointValue`,
                  )}
                  type="number"
                  className={cn("w-12 rounded-md border p-1 text-center")}
                />
                <div
                  className={cn(
                    "rounded-full p-1 opacity-0 transition-all hover:cursor-pointer hover:bg-primary hover:text-white group-hover:opacity-100",
                  )}
                >
                  <Trash2Icon
                    className={cn("size-4")}
                    type="button"
                    onClick={() => remove(k)}
                  />
                </div>
              </motion.div>
            ))}
        </div>
      </AnimatePresence>
      <div className="flex items-center justify-between opacity-0 transition-all group-hover:opacity-100">
        <PlusCircleIcon
          type="button"
          onClick={() =>
            append({
              id: v4(),
              questionId: getValues(`questions.${nestIndex}.id`)!,
              text: "",
              position: fields.length + 1,
              pointValue: "0",
              updatedAt: new Date(),
            })
          }
          className={cn(
            "group mt-2 cursor-pointer rounded-full p-1 opacity-0 transition-all hover:bg-primary hover:text-white group-hover:opacity-100",
          )}
        />
        <div className="mr-8 space-x-2">
          <Label className="text-xs" htmlFor="feedback">
            Require Feedback?
          </Label>
          <Controller
            name={`questions.${nestIndex}.feedback`}
            control={control}
            render={({ field }) => (
              <Switch
                size={"xs"}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
