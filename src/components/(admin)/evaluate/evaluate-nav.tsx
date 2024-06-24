import { Glass } from "@/components/ui/glass";
import { Progress } from "@/components/ui/progress";
import Counter from "@/components/ui/counter";
import { Stopwatch } from "@/components/ui/stopwatch";

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
    <div className="fixed top-16 z-50 w-full px-8">
      <Glass className="z-50 h-16 w-full px-8">
        <div className="grid h-full grid-cols-3 -mt-2.5">
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
                className="font-light tabular-nums"
                value={progressPercentage}
                type="percent"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Stopwatch className="text-3xl " />
          </div>
          <div className="flex flex-col items-end justify-center">
            <p className="text-neutral-700 font-medium">{evaluateeName}</p>
            <p className="text-neutral-400">{evaluatorName}</p>
          </div>
        </div>
      </Glass>
    </div>
  );
}
