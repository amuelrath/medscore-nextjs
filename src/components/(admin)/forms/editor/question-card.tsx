"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { SelectMilestoneDialogTrigger } from "@/components/(admin)/forms/dialogs/select-milestone-dialog";
import { FormResult, TFormRelate, TSubcompetencyRelate } from "@/db/types";
import { MilestoneBadgeList } from "@/components/(admin)/forms/editor/milestone-badge-list";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";

interface QuestionCardProps {
  item: FormResult["questions"][0];
  index: number;
  subcompetencies: TSubcompetencyRelate[];
}

export const QuestionCard: FC<QuestionCardProps> = ({
  item,
  index,
  subcompetencies,
}) => {
  const { register, control } = useFormContext<TFormRelate>();
  const { remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <motion.div
      layout="position"
      layoutId={`question-${item.id}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      className="my-4"
    >
      <Glass intensity="xl" className="group space-y-2 p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-bold">{item.position}.</p>
            <MilestoneBadgeList
              milestoneIds={item.milestones.map((m) => m.milestoneId)}
              subcompetencies={subcompetencies}
            />
          </div>
          <button
            onClick={() => remove(index)}
            className="rounded-full p-1 opacity-0 transition-all hover:bg-primary hover:text-white group-hover:opacity-100"
          >
            <Trash2Icon size="1rem" />
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2">
          <Input
            type="text"
            {...register(`questions.${index}.text`)}
            placeholder="Question"
            className="bg-blue-950 bg-opacity-5 p-2 shadow-inner backdrop-blur-3xl"
          />
          <SelectMilestoneDialogTrigger
            index={index}
            question={item}
            control={control}
          />
        </div>

        <OptionList questionIndex={index} />
      </Glass>
    </motion.div>
  );
};
