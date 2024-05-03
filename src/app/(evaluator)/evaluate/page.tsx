import EvaluateDialog from "@/components/(evaluate)/dialogs/evaluate-dialog";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import { cn } from "@/lib/utils";
import RESPONSES from "public/icons/wired-flat-1334-order-history.json";

export default async function EvaluationForm() {
  return (
    <div className={cn("flex flex-col items-center")}>
      <div
        className={cn(
          "flex flex-col justify-center items-center text-center px-16  p-4"
        )}
      >
        <h1 className={cn("text-4xl  font-bold")}>Good Afternoon, Dr. Phil.</h1>
        <h3 className={cn("text-xl tracking-wide font-bold text-primary/60")}>
          What would you like to do?
        </h3>
      </div>
      <div
        className={cn("flex flex-row space-x-4 items-center justify-center")}
      >
        <EvaluateDialog />

        <LottieIconButton
          variant={"hide"}
          className={cn(
            "flex flex-col text-white bg-gradient-to-t from-foreground to-foreground/70 text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition-all w-60 h-32 rounded-md"
          )}
          icon={RESPONSES}
          label="Response History"
        />
      </div>
    </div>
  );
}
