"use client";
import { ClientQuestion } from "@/db/client-types";
import { Card } from "@/components/ui/card";
import OptionList from "./options";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import { createOption, deleteQuestion, updateQuestion } from "../../actions";
import React from "react";
import MilestoneSelector from "./milestone-selector";
import { ClientMilestone } from "@/db/client-types";
export default function QuestionCard({
  milestones,
  question,
  index,
}: {
  question: ClientQuestion;
  index: number;
  milestones: ClientMilestone[];
}) {
  const handleDeleteQuestion = async () => {
    await deleteQuestion(question.id);
  };

  const handleAddOption = async () => {
    await createOption(question.id);
  };

  const handleEditText = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateQuestion(question.id, { text: e.target.value });
  };

  return (
    <motion.div layout="position">
      <Card className={cn(`group p-4 pl-4 space-y-2`)}>
        <div className={cn("flex flex-row justify-between")}>
          <p className={cn("font-bold")}>{index + 1}.</p>

          <div
            onClick={handleDeleteQuestion}
            className={cn(
              "opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-primary hover:text-white transition-all p-1 rounded-full"
            )}
          >
            <Trash2Icon size={"1rem"} />
          </div>
        </div>
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Input
            type="text"
            onChange={handleEditText}
            defaultValue={question?.text || ""}
            placeholder="Question"
            className={cn("p-2")}
          />

          <MilestoneSelector milestones={milestones} question={question} />
        </div>
        <div></div>
        <div>
          <OptionList options={question?.options || []} />
          <PlusCircleIcon
            className={cn(
              "mt-2 cursor-pointer group group-hover:opacity-100 opacity-0 hover:bg-primary hover:text-white transition-all p-1 rounded-full"
            )}
            onClick={handleAddOption}
          />
        </div>
      </Card>
    </motion.div>
  );
}
