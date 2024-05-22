import EvaluateDialog from "@/components/(evaluator)/dialogs/evaluate-dialog";
import { cn } from "@/lib/utils";
import RESPONSES from "public/icons/wired-flat-1334-order-history.json";
import { DynamicLottieIconButton } from "@/components/ui/lottie-icon-button";

export default async function EvaluationForm() {
  return (
    <div className={cn("flex flex-col items-center")}>
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 px-16  text-center",
        )}
      >
        <h1 className={cn("text-4xl  font-bold")}>Good Afternoon, Dr. Phil.</h1>
        <h3 className={cn("text-xl font-bold tracking-wide text-primary/60")}>
          What would you like to do?
        </h3>
      </div>
      <div
        className={cn("flex flex-row items-center justify-center space-x-4")}
      >
        <EvaluateDialog />

        <DynamicLottieIconButton
          variant={"hide"}
          className={cn(
            "flex h-32 w-60 flex-col rounded-md bg-gradient-to-t from-foreground to-foreground/70 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-xl",
          )}
          icon={RESPONSES}
          label="Response History"
        />
      </div>
    </div>
  );
}
