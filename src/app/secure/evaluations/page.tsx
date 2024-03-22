import EvaluationCard from "./components/evaluation-card";
import { db } from "@/db";
import PageHeader from "@/components/ui/page-header";
import CreateEvaluation from "./components/create-evaluation";

export default async function SecureHomePage() {
  const evaluations = await db.query.evaluation.findMany({
    with: {
      program: true,
    },
  });

  return (
    <main className="min-h-screen w-full space-y-2">
      <PageHeader
        title="Evaluations"
        subtitle="your draft evaluations will live here"
      >
        <CreateEvaluation />
      </PageHeader>
      <div className="w-full grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-2 px-2">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </main>
  );
}
