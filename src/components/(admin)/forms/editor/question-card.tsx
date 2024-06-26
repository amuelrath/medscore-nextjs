import { FC } from "react";
import { motion } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import { Input } from "@/components/ui/input";
import { Trash2Icon, CopyIcon } from "lucide-react";
import { OptionList } from "@/components/(admin)/forms/editor/question-options";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { MilestoneMultiselect } from "@/components/(admin)/forms/editor/milestone-multiselect";

interface QuestionCardProps {
  question: TFormSchema["questions"][0];
  control: Control<TFormSchema>;
  index: number;
  removeQuestion: UseFieldArrayRemove;
  duplicateQuestion: () => void;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  index,
  control,
  removeQuestion,
  duplicateQuestion,
}) => {
  return (
    <motion.div
      layout="position"
      layoutId={`question-${question.id}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      className="my-4"
    >
      <Glass intensity="xl" className="group space-y-3 p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-4">
            <p className="font-bold">{index + 1}.</p>
            <Controller
              name={`questions.${index}.milestoneIds`}
              control={control}
              render={({ field }) => (
                <MilestoneMultiselect
                  value={field.value}
                  onChange={field.onChange}
                  defaultValues={question.milestoneIds}
                />
              )}
            />
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
            className="bg-blue-950 bg-opacity-10 p-2 shadow-inner backdrop-blur-3xl"
          />
        </div>

        <OptionList questionIndex={index} />
      </Glass>
    </motion.div>
  );
};
