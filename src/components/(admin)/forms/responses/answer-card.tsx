"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotebookIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormVersionsResult } from "@/db/types";
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { Glass } from "@/components/ui/glass";
import { useState } from "react";
import { AutosizeTextarea } from "@/components/ui/autosize-text-area";

export function AnswerCard({
  question,
}: {
  question: FormVersionsResult[0]["questions"][0];
}) {
  const { selectedResponse } = useResponseContext();
  const [commentsOpen, setCommentsOpen] = useState<boolean>(question.feedback)

  const selectedOptionId = selectedResponse?.answers.find(
    (a) => a.questionVersionId === question.id,
  )?.optionVersionId;

  const evaluatorFeedback = selectedResponse?.answers.find((a) => a.questionVersionId === question.id)?.feedback

  return (
    <Glass
      intensity={"xl"}
      className={cn("text-md group w-full space-y-4 rounded-lg p-4")}
    >
      <div className="flex flex-row items-center justify-between space-x-2 px-2">
        <div className="flex flex-row items-center space-x-2">
          <p className="font-bold">{question.position}.</p>
          <p className="">{question.text}</p>
        </div>
        {!selectedResponse && (
          <NotebookIcon
            className="text-current opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={1.5}
            size={20}
          />
        )}
      </div>
      <RadioGroup disabled={!selectedResponse}>
        <div className="flex w-full flex-col space-y-2">
          {question.options
            ?.sort((a, b) => a.position - b.position)
            .map(({ id, text }) => (
              <div
                key={id}
                className={cn(
                  "relative flex select-none items-center justify-start space-x-1 rounded-sm transition-all hover:bg-gray-100",
                )}
              >
                <RadioGroupItem
                  id={id}
                  className={
                    cn("bg-blue-950 bg-opacity-5 p-3 rounded-md shadow-inner backdrop-blur-3xl", selectedOptionId !== id && "border-inherit")
                  }
                  label={text || ""}
                  disabled={!selectedResponse}
                  value={id}
                  checked={selectedOptionId === id}
                />
              </div>
            ))}
        </div>
      </RadioGroup>
      {evaluatorFeedback && (
      <AutosizeTextarea disabled={!!selectedResponse} value={evaluatorFeedback}  minHeight={30} placeholder="Comments/Feedback" className={cn("no-scrollbar bg-blue-950 bg-opacity-5 p-3 rounded-md shadow-inner backdrop-blur-3xl disabled:cursor-default disabled:opacity-100 disabled:resize-none")}/>
      )}
    </Glass>
  );
}
