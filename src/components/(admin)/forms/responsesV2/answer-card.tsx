"use client";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotebookIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormVersionsResult } from "@/db/types";
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";

export function AnswerCard({
  question,
}: {
  question: FormVersionsResult[0]["questions"][0];
}) {
  const { selectedResponse } = useResponseContext();

  const selectedOptionId = selectedResponse?.answers.find(
    (a) => a.questionVersionId === question.id,
  )?.optionVersionId;

  return (
    <Card className={cn("text-md group w-full space-y-4 p-4")}>
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
        <div className="flex w-full flex-col space-y-1">
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
                  label={text || ""}
                  disabled={!selectedResponse}
                  value={id}
                  checked={selectedOptionId === id}
                />
              </div>
            ))}
        </div>
      </RadioGroup>
    </Card>
  );
}
