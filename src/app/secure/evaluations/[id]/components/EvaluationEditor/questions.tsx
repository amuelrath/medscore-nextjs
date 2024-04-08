"use client";
import { ClientQuestion, ClientSubcompetency } from "@/db/client-types";
import { Card } from "@/components/ui/card";
import OptionList from "./options";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import { createOption, deleteQuestion, updateQuestion } from "../../actions";
import React from "react";
import MilestoneSelector from "../MilestoneSelect/index";
import { Badge } from "@/components/ui/badge";
import { Milestone } from "@/db/schema";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function QuestionCard({
  subcompetencies,
  question,
  index,
}: {
  question: ClientQuestion;
  index: number;
  subcompetencies: ClientSubcompetency[];
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

  const getAllocatedMilestones = () => {
    const result: Milestone[] = [];
    const allocations = () => {
      const result: string[] = [];
      question.milestones.map((m) => {
        result.push(m.milestoneId);
      });
      return result;
    };

    allocations().forEach((allocation) => {
      for (const s of subcompetencies) {
        for (const m of s.milestones) {
          if (allocation === m.id) {
            result.push(m);
          }
        }
      }
    });
    return result;
  };

  return (
    <motion.div layout="position">
      <Card className={cn(`group p-4 pl-4 space-y-2`)}>
        <div className={cn("flex flex-row justify-between")}>
          <div className={cn("flex space-x-2 items-center")}>
            <p className={cn("font-bold")}>{index + 1}.</p>
            <div className={cn("space-x-2")}>
              {getAllocatedMilestones().map((m) => (
                <TooltipProvider key={`badge-${m.id}`}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge>{m.name}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{m.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
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

          <MilestoneSelector
            subcompetencies={subcompetencies}
            question={question}
          />
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
