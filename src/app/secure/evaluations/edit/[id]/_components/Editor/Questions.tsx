"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { VersionedEvaluation } from "@/db/client-types";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OptionList from "./Options";
import { ClientSubcompetency } from "@/db/client-types";
import { v4 } from "uuid";
import { useEffect, useRef } from "react";
import MilestoneSelector from "../MilestoneSelect";
import { MilestonesOnQuestion, Option } from "@/db/schema";

export default function QuestionCards({
  subcompetencies,
}: {
  subcompetencies: ClientSubcompetency[];
}) {
  const { control, register, getValues } =
    useFormContext<VersionedEvaluation>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "questions",
  });

  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevFieldsLengthRef = useRef<number>(fields.length);

  // smooth scroll when we add a new milestone
  useEffect(() => {
    if (lastItemRef.current && fields.length > prevFieldsLengthRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
    prevFieldsLengthRef.current = fields.length;
  }, [fields.length]);

  return (
    <AnimatePresence>
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
              onAnimationComplete={(definition) => {
                if (definition === "initial" && index === fields.length - 1) {
                  remove(index);
                }
              }}
              ref={index === fields.length - 1 ? lastItemRef : null}
            >
              <Card className={cn(`group p-4 space-y-2`)}>
                <div className={cn("flex flex-row justify-between")}>
                  <div className={cn("flex space-x-2 items-center")}>
                    <p className={cn("font-bold")}>{index + 1}.</p>
                    <div className={cn("space-x-2")}>
                      <Controller
                        name={`questions.${index}.milestones`}
                        control={control}
                        render={({ field }) => (
                          <MilestoneBadges
                            subcompetencies={subcompetencies || []}
                            milestoneIds={field.value.flatMap(
                              (m) => m.milestoneId
                            )}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-primary hover:text-white transition-all p-1 rounded-full"
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
                        values={item.milestones.flatMap((m) => m.milestoneId)}
                      />
                    )}
                  />
                </div>
                <div>
                  <OptionList {...{ nestIndex: index, control, register }} />
                </div>
              </Card>
            </motion.div>
          ))}
      </div>
      <motion.div layout className={cn("flex justify-center mt-4")}>
        <motion.div
          layoutId="add-question"
          className={cn(
            "hover:text-white hover:bg-primary transition-all rounded-full p-1 cursor-pointer"
          )}
          onClick={() => {
            append({
              id: v4(),
              text: "",
              feedback: false,
              position: fields.length + 1,
              milestones: [] as MilestonesOnQuestion[],
              options: [] as Option[],
              versionNumber: getValues("versions").length,
              formId: getValues(`id`),
            });
          }}
        >
          <PlusCircleIcon />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MilestoneBadges({
  milestoneIds,
  subcompetencies,
}: {
  milestoneIds: string[];
  subcompetencies: ClientSubcompetency[];
}) {
  const milestoneObjects = subcompetencies.map((sc) => sc.milestones).flat();

  return (
    <>
      {milestoneIds.map((mId) => {
        const milestone = milestoneObjects.find((m) => m.id === mId);
        if (milestone) {
          return (
            <TooltipProvider key={`badge-${milestone.id}`}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge>{milestone.name}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{milestone.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
      })}
    </>
  );
}
