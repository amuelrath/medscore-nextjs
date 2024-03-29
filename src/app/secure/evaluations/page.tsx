import EvaluationCard from "./components/evaluation-card";
import { db } from "@/db";
import PageHeader from "@/components/ui/page-header";
import CreateEvaluation from "./components/create-evaluation";
import { cn } from "@/lib/utils";

export default async function SecureHomePage() {
  const evaluations = await db.query.evaluations.findMany({
    with: {
      programs: true,
    },
  });

  return (
    <main className={cn("min-h-screen w-full space-y-2")}>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Evaluations</h2>
          <p className={cn("text-sm")}>your drafts will live here</p>
        </div>
        <CreateEvaluation />
      </PageHeader>
      <div
        className={cn(
          "w-full grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-2 px-2"
        )}
      >
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </main>
  );
}
