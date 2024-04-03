"use client";
import { ClientQuestion } from "@/db/client-types";
import { Card } from "@/components/ui/card";
import OptionList from "./options";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import { createOption, deleteQuestion, updateQuestion } from "../../actions";
import { AnimatePresence } from "framer-motion";
import React from "react";
export default function QuestionCard({
  question,
  index,
}: {
  question: ClientQuestion;
  index: number;
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
    <Card className={cn("p-4")}>
      <div className={cn("flex flex-row justify-between relative")}>
        {index + 1}

        <div
          onClick={handleDeleteQuestion}
          className={cn(
            "cursor-pointer hover:bg-primary hover:text-white transition-all p-1 rounded-full"
          )}
        >
          <Trash2Icon size={"1.25rem"} />
        </div>
      </div>
      <div className={cn("space-y-4")}>
        <Input
          type="text"
          onChange={handleEditText}
          defaultValue={question?.text || ""}
          placeholder="Question"
          className={cn("p-2")}
        />
        <div>
          <AnimatePresence>
            <OptionList options={question?.options || []} />
          </AnimatePresence>
          <PlusCircleIcon
            className={cn(
              "cursor-pointer hover:bg-primary hover:text-white transition-all p-1 rounded-full"
            )}
            onClick={handleAddOption}
          />
        </div>
      </div>
    </Card>
  );
}
