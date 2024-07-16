"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useFormResultInEditor } from "@/hooks/queries/use-form-result-in-editor";
import { getAnswerTotalsViewByResponseId } from "@/server/actions/responses/get-answer-totals-view";
import { TFormItemType } from "@/db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export function Answers() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { formResult } = useFormResultInEditor();

  const {
    data: answerTotals,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["answerTotals", selectedResponseId],
    queryFn: () => getAnswerTotalsViewByResponseId(selectedResponseId || ""),
    enabled: !!selectedResponseId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading answers</div>;

  // Create a Map of formItemId to answers
  const answerMap = new Map();
  if (answerTotals) {
    answerTotals
      .filter((at) => at.responseId === selectedResponseId)
      .forEach((answer) => {
        if (!answerMap.has(answer.formItemId)) {
          answerMap.set(answer.formItemId, []);
        }
        answerMap.get(answer.formItemId).push(answer);
      });
  }

  return (
    <div key={selectedResponseId} className="h-[68vh] overflow-y-scroll py-4 p-4">
      {formResult?.formItems.map((item) => {
        const answers = answerMap.get(item.id) || [];
        const selectedOptionIds = answers
          .map((a) => a.selectedOptionId)
          .filter(Boolean);
        const textValue = answers.find((a) => a.textValue)?.textValue;

        return (
          <AnswerCard
            key={item.id}
            id={item.id}
            text={item.text}
            type={item.type as TFormItemType}
            options={item.options.map((option) => ({
              ...option,
              isSelected: selectedOptionIds.includes(option.id),
            }))}
            textValue={textValue}
            position={item.position}
          />
        );
      })}
    </div>
  );
}

interface Option {
  id: string;
  text?: string | null;
  position: number;
  isSelected: boolean;
}

interface AnswerCardProps {
  id: string;
  text?: string | null;
  type: TFormItemType;
  options: Option[];
  textValue?: string;
  position: number;
}

function AnswerCard({
  text,
  type,
  options,
  textValue,
  position,
}: AnswerCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium">Question {position}</h3>
        <span className="text-xs text-gray-500">{type.replace("_", " ")}</span>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm">{text}</p>

        {type === "WRITTEN" && (
          <p className="mt-2 rounded bg-gray-100 p-2">
            {textValue || "No answer provided"}
          </p>
        )}

        {(type === "MULTIPLE_CHOICE" || type === "SINGLE_CHOICE") && (
          <ul className="space-y-2">
            {options.map((option) => (
              <li key={option.id} className="flex items-center space-x-2">
                {option.isSelected ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
                <span
                  className={
                    option.isSelected ? "font-medium" : "text-gray-600"
                  }
                >
                  {option.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
