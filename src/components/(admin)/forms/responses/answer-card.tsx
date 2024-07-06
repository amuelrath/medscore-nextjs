"use client";

import { useState, useRef, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotebookIcon } from "lucide-react";
import { cn } from "@/lib/helpers/utils";
import { Glass } from "@/components/ui/glass";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-text-area";

type Option = {
  id: string;
  position: number;
  text: string | null;
};

type AnswerCardProps = {
  id: string;
  position: number;
  text?: string | null;
  options?: Option[];
  control?: Control<any>;
  name?: string;
  feedbackName?: string;
  feedbackRequired?: boolean;
  selectedOptionId?: string;
  feedback?: string;
  additionalInfo?: React.ReactNode;
  renderOptions?: (options: Option[]) => React.ReactNode;
  renderAdditionalInfo?: (props: any) => React.ReactNode;
};

export function AnswerCard({
  position,
  text,
  options = [],
  control,
  name,
  feedbackName,
  feedbackRequired = false,
  selectedOptionId,
  feedback,
  additionalInfo,
  renderOptions,
  renderAdditionalInfo,
}: AnswerCardProps) {
  const [showFeedback, setShowFeedback] = useState(feedbackRequired);
  const feedbackRef = useRef<AutosizeTextAreaRef>(null);
  const isInput = !!control && !!name;

  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.textArea.focus();
    }
  }, [showFeedback]);

  const handleNotebookClick = () => {
    setShowFeedback((prev) => !prev);
  };

  const renderOptionItems = (options: Option[]) => (
    <div className="flex w-full flex-col space-y-2">
      {options
        .sort((a, b) => a.position - b.position)
        .map(({ id, text }) => (
          <div
            key={id}
            className="relative flex select-none items-center justify-start space-x-1 transition-all hover:bg-teal-50"
          >
            <RadioGroupItem
              id={id}
              className="rounded-md bg-blue-800 bg-opacity-5 p-3 shadow-inner"
              label={text || ""}
              value={id}
              disabled={!isInput}
            />
          </div>
        ))}
    </div>
  );

  const renderFeedbackArea = () => {
    const commonProps = {
      minHeight: 30,
      placeholder: "Comments/Feedback",
      rows: 1,
      className:
        "no-scrollbar rounded-md bg-blue-800/5 p-3 shadow-inner",
    };

    return isInput ? (
      <Controller
        name={feedbackName!}
        control={control}
        render={({ field }) => (
          <AutosizeTextarea {...field} {...commonProps} ref={feedbackRef} />
        )}
      />
    ) : (
      <AutosizeTextarea
        ref={feedbackRef}
        disabled
        value={feedback}
        {...commonProps}
        className={cn(
          commonProps.className,
          "disabled:cursor-default bg-blue-800/5 shadow-inner disabled:resize-none disabled:opacity-100",
        )}
      />
    );
  };

  return (
    <div
      className="text-md shadow-md border border-white selct-none bg-card group w-full space-y-3 rounded-xl p-4"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold select-none">{position}.</p>
          {isInput && !feedbackRequired && (
            <NotebookIcon
              className="cursor-pointer text-current transition-opacity hover:opacity-50"
              strokeWidth={1.5}
              size={20}
              onClick={handleNotebookClick}
            />
          )}
        </div>
        <p className="text-wrap select-none pl-1 font-medium">{text}</p>
      </div>
      {isInput ? (
        <Controller
          name={name!}
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} value={field.value}>
              {renderOptions
                ? renderOptions(options)
                : renderOptionItems(options)}
            </RadioGroup>
          )}
        />
      ) : (
        <RadioGroup disabled value={selectedOptionId}>
          {renderOptions ? renderOptions(options) : renderOptionItems(options)}
        </RadioGroup>
      )}
      {(showFeedback || (!isInput && feedback)) && renderFeedbackArea()}
      {!isInput &&
        renderAdditionalInfo &&
        renderAdditionalInfo({ feedback, additionalInfo })}
    </div>
  );
}
