import Section from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function EvaluationLoading() {
  return (
    <Section>
      <div className={cn("w-full flex justify-center")}>
        <Loader2
          strokeWidth={2}
          size="4rem"
          className={cn("animate-spin text-primary")}
        />
      </div>
    </Section>
  );
}
