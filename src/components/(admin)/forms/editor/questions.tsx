"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OptionList from "@/components/(admin)/forms/editor/question-options";
import { TFormRelate, TQuestionRelate, TSubcompetencyRelate } from "@/db/types";
import { v4 } from "uuid";
import { saveForm } from "@/server/actions/forms/save-form";
import { useFormValues } from "@/providers/form-values-provider";
import { SelectMilestoneDialogTrigger } from "@/components/(admin)/forms/dialogs/select-milestone-dialog";
import { questions } from "@/db/schema";

export default function QuestionCards() {
  const { subcompetencies, form } = useFormValues();
  const { control, register, getValues, handleSubmit } =
    useFormContext<TFormRelate>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "questions",
  });
  const onSubmit = async () => {
    try {
      await saveForm(getValues());
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };
  return (
    <AnimatePresence>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("pb-[10rem] pt-[5rem]")}
      >
        <div className={cn("space-y-4")}>
          {fields.map((item, index) => {
            // because react-hook-form also has an Id prop which gets taken by 'item'
            // rather than the actual questionId
            const question = form.questions.find(q => q.position === item.position) as unknown as TQuestionRelate


            return (
              <motion.div
                key={`question-${item.id}`}
                layout="position"
                layoutId={`question-${item.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                <Card className={cn(`group space-y-2 p-4`)}>
                  <div className={cn("flex flex-row justify-between")}>
                    <div className={cn("flex items-center space-x-2")}>
                      <p className={cn("font-bold")}>{item.position}.</p>
                      <div className={cn("space-x-2")}>
                        <Controller
                          name={`questions.${index}.milestones`}
                          control={control}
                          render={({ field }) => (
                            <MilestoneBadges
                              milestoneIds={
                                field.value.flatMap(
                                  (m) => m.milestoneId,
                                ) as string[]
                              }
                              subcompetencies={subcompetencies}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "cursor-pointer rounded-full p-1 opacity-0 transition-all hover:bg-primary hover:text-white group-hover:opacity-100",
                      )}
                    >
                      <Trash2Icon onClick={() => remove(index)} size={"1rem"} />
                    </div>
                  </div>
                  <div className={cn("flex flex-row items-center space-x-2")}>
                    <Input
                      type="text"
                      {...register(`questions.${index}.text`)}
                      placeholder="Question"
                      className={cn("p-2")}
                    />

                    <SelectMilestoneDialogTrigger
                      index={index}
                      question={question ?? item}
                      control={control}
                    />
                  </div>
                  <OptionList {...{ nestIndex: index, control, register }} />
                </Card>
              </motion.div>
            );
          })}
        </div>
        <motion.div layout className={cn("mt-4 flex justify-center")}>
          <motion.div
            layoutId="add-question"
            className={cn(
              "cursor-pointer rounded-full p-1 transition-all hover:bg-primary hover:text-white",
            )}
            onClick={() => {
              const newPosition = fields.length + 1;
              //@ts-ignore
              append({
                id: v4(),
                text: "",
                simpleDescription: null,
                feedback: false,
                position: newPosition,
                milestones: [],
                options: [],
                formId: getValues(`id`) || "",
              });
            }}
          >
            <PlusCircleIcon />
          </motion.div>
        </motion.div>
      </form>
    </AnimatePresence>
  );
}

function MilestoneBadges({
  milestoneIds,
  subcompetencies,
}: {
  milestoneIds: string[];
  subcompetencies: TSubcompetencyRelate[];
}) {
  const milestones = subcompetencies
    .flatMap((sc) => sc.milestones)
    .filter((m) => milestoneIds.includes(m.id));
  return (
    <>
      {milestones.map((m) => (
        <TooltipProvider key={`badge-${m.id}`}>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant={"foreground"}
                className={cn("px-3 text-xs font-normal")}
              >
                {m.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{m.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
}
