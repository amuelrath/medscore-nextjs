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
import { TFormRelate, TSubcompetencyRelate } from "@/db/types";
import { v4 } from "uuid";
import MilestoneSelector from "./MilestoneSelect";
import { saveForm } from "@/server/actions/forms/save-form";

export default function QuestionCards({
  subcompetencies,
}: {
  subcompetencies: TSubcompetencyRelate[];
}) {
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
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return (
    <AnimatePresence>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cn("space-y-4")}>
          {fields
            .sort((a, b) => a.position! - b.position!)
            .map((item, index) => (
              <motion.div
                key={`question-${item.id}`}
                layout="position"
                layoutId={`question-${item.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                <Card className={cn(`group space-y-2 p-4`)}>
                  <div className={cn("flex flex-row justify-between")}>
                    <div className={cn("flex items-center space-x-2")}>
                      <p className={cn("font-bold")}>{index + 1}.</p>
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
                    <Controller
                      name={`questions.${index}.milestones`}
                      control={control}
                      render={({ field }) => (
                        <MilestoneSelector
                          onChange={field.onChange}
                          subcompetencies={subcompetencies}
                          values={item.milestones}
                        />
                      )}
                    />
                  </div>
                  <OptionList {...{ nestIndex: index, control, register }} />
                </Card>
              </motion.div>
            ))}
        </div>
        <motion.div layout className={cn("mt-4 flex justify-center")}>
          <motion.div
            layoutId="add-question"
            className={cn(
              "cursor-pointer rounded-full p-1 transition-all hover:bg-primary hover:text-white",
            )}
            onClick={() => {
              append({
                id: v4(),
                text: "",
                feedback: false,
                position: fields.length + 1,
                milestones: [],
                options: [],
                deletedAt: null,
                formId: getValues(`id`) || "",
                updatedAt: new Date(),
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
              <Badge>{m.name}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className={cn("w-[400px] text-lg")}>{m.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
}
