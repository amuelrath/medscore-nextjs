"use client";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { VersionedEvaluation } from "@/db/client-types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { useRef, useEffect } from "react";

export default function Option({ nestIndex }: { nestIndex: number }) {
  const { control, register, getValues } =
    useFormContext<VersionedEvaluation>();
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
              onAnimationComplete={(definition) => {
                if (definition === "initial" && k === fields.length - 1) {
                  remove(k);
                }
              }}
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
      <PlusCircleIcon
        type="button"
        onClick={() =>
          append({
            id: v4(),
            questionId: getValues(`questions.${nestIndex}.id`),
            text: "",
            position: fields.length + 1,
            pointValue: "0",
            versionNumber: getValues(`questions.${nestIndex}.versionNumber`), // MARK:FIX FIX FIX FIX FIX
          })
        }
        className={cn(
          "mt-2 cursor-pointer group group-hover:opacity-100 opacity-0 hover:bg-primary hover:text-white transition-all p-1 rounded-full"
        )}
      />
    </>
  );
}
