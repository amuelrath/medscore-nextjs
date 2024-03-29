import PageHeader from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, Loader2 } from "lucide-react";

export default function EvaluationLoading() {
  return (
    <main className={cn("min-h-screen w-full space-y-2")}>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Evaluations</h2>
          <p className={cn("text-xs")}>your drafts will live here</p>
        </div>
        <PlusCircleIcon />
      </PageHeader>
      <div className={cn("h-full flex flex-col justify-center items-center")}>
        <Loader2
          strokeWidth={2}
          size="4rem"
          className={cn("animate-spin text-primary")}
        />
      </div>
    </main>
  );
}
