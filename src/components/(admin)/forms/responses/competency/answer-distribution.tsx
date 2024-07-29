import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";

export function AnswerDistribution({
  numCorrect,
  numIncorrect,
  numUnanswered,
}: {
  numCorrect: number;
  numIncorrect: number;
  numUnanswered: number;
}) {
  return (
    <div className="grid h-full w-full grid-cols-3 place-items-center items-start gap-x-4 ">
      <EnhancedTooltip description="Correct">
        <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center p-2">
          <p className="font-mono text-lg">{numCorrect}</p>
          <span className="flex size-6 flex-row  items-center justify-center rounded-full bg-neutral-600 text-white">
            <CheckIcon size={16} />
          </span>
        </div>
      </EnhancedTooltip>
      <EnhancedTooltip description="Incorrect">
        <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center p-2">
          <p className="font-mono text-lg">{numIncorrect}</p>
          <span className="flex size-6 flex-row items-center justify-center rounded-full bg-neutral-600 text-white">
            <XIcon size={16} />
          </span>
        </div>
      </EnhancedTooltip>
      <EnhancedTooltip description="Partial or Unanswered">
        <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center p-2">
          <p className="font-mono text-lg">{numUnanswered}</p>
          <span className="flex size-6 flex-row items-center justify-center rounded-full bg-neutral-600 text-white">
            <MinusIcon size={16} />
          </span>
        </div>
      </EnhancedTooltip>
    </div>
  );
}