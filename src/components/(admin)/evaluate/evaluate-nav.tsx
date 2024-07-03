import { Progress } from "@/components/ui/progress";
import Counter from "@/components/ui/counter";
import { Stopwatch } from "@/components/ui/stopwatch";
import { cn } from "@/lib/utils";

interface EvaluateNavProps {
  formTitle: string;
  evaluatorName: string;
  evaluateeName: string;
  totalQuestions: number;
  completedQuestions: number;
}

export function EvaluateNav({
  formTitle,
  evaluatorName,
  evaluateeName,
  totalQuestions,
  completedQuestions,
}: EvaluateNavProps) {
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  return (
    <div className="flex h-16 w-full flex-row items-center justify-between border-b border-accent-secondary bg-card px-8">
      <div className={cn("flex w-full flex-row items-center justify-between")}>
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-2xl font-bold text-neutral-700 xs:text-2xl">
            {formTitle}
          </h3>
          <div className="flex w-full flex-row items-center space-x-2 text-sm">
            <Progress
              className="mt-1 h-2 w-full max-w-[200px]"
              value={progressPercentage}
            />
            <Counter
              className="font-light proportional-nums max-w-1"
              value={progressPercentage}
              type="percent"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Stopwatch className="text-3xl " />
        </div>
        <div className="flex flex-col items-end justify-center">
          <p className="font-medium text-neutral-700">{evaluateeName}</p>
          <p className="text-neutral-400">{evaluatorName}</p>
        </div>
      </div>
    </div>
  );
}
