import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function EvaluationLoading() {
  return (
    <div className={cn("h-full flex flex-col justify-center items-center")}>
      <Loader2
        strokeWidth={2}
        size="4rem"
        className={cn("animate-spin text-primary")}
      />
    </div>
  );
}
