import { FC } from "react";
import { m } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2Icon, CopyIcon, MilestoneIcon } from "lucide-react";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import { cn } from "@/lib/helpers/utils";
import { MilestoneBadges } from "@/components/(admin)/forms/editor/milestone-badges";

interface QuestionCardProps {
  question: TFormSchema["questions"][0];
  control: Control<TFormSchema>;
  index: number;
  removeQuestion: UseFieldArrayRemove;
  duplicateQuestion: () => void;
  isSelected: boolean;
  selectQuestion: () => void;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  index,
  control,
  removeQuestion,
  duplicateQuestion,
  isSelected,
  selectQuestion,
}) => {
  return (
    <m.div
      layout="position"
      layoutId={`question-${question.id}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      className="mx-2 my-4"
    >
      <div
        className={cn(
          "group bg-card rounded-xl border-2 border-white shadow-md space-y-3 p-4 transition-all",
          isSelected && "ring ring-accent",
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-4">
            <p className="font-bold">{index + 1}.</p>
            <MilestoneIcon
              onClick={selectQuestion}
              className={cn(
                "size-4 cursor-pointer transition-colors",
                isSelected ? "text-accent" : "hover:text-accent",
              )}
            />
            <MilestoneBadges questionIndex={index} />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={duplicateQuestion}
              className="rounded-full opacity-0 transition-all hover:text-primary/90 group-hover:opacity-100"
            >
              <CopyIcon size="1rem" />
            </button>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="rounded-full opacity-0 transition-all hover:text-destructive/90 group-hover:opacity-100"
            >
              <Trash2Icon size="1rem" />
            </button>
          </div>
        </div>

        <div className="pr-8">
          <Input
            type="text"
            {...control.register(`questions.${index}.text`)}
            placeholder="Question"
            className="bg-blue-800 bg-opacity-5 p-2 shadow-inner backdrop-blur-3xl"
          />
        </div>

        <OptionList questionIndex={index} />
      </div>
    </m.div>
  );
};
