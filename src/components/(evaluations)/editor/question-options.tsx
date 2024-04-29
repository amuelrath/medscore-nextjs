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
          {fields.map((item, k) => (
            <motion.div
              key={item.id}
              layout="position"
              layoutId={`option-${item.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn("flex items-center space-x-2 group w-full")}
            >
              <Input
                {...register(`questions.${nestIndex}.options.${k}.text`)}
                className={cn("p-2 border rounded-md")}
                placeholder={"Option"}
              />
              <Input
                placeholder="Points"
                {...register(`questions.${nestIndex}.options.${k}.pointValue`)}
                type="number"
                className={cn("w-12 text-center border rounded-md p-1")}
              />
              <div
                className={cn(
                  "group-hover:opacity-100 hover:cursor-pointer opacity-0 hover:bg-primary hover:text-white rounded-full transition-all p-1"
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
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
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
            "mt-2 cursor-pointer group group-hover:opacity-100 opacity-0 hover:bg-primary hover:text-white transition-all p-1 rounded-full"
          )}
        />
        <div className="space-x-2 mr-8">
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
