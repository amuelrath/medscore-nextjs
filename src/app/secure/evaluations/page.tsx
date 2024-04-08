import { db } from "@/db";
import PageHeader from "@/components/ui/page-header";
import CreateEvaluation from "./components/create-evaluation";
import { cn } from "@/lib/utils";
import EvaluationCards from "./components/evaluation-card-list";

export default async function SecureHomePage() {
  const evaluations = await db.query.evaluations.findMany({
    with: {
      programs: {
        with: {
          specialties: {
            with: {
              subcompetencies: {
                with: { milestones: true, competencies: true },
              },
            },
          },
        },
      },
      questions: {
        with: {
          milestones: true,
          options: true,
        },
      },
    },
  });

  return (
    <main className={cn("min-h-screen w-full space-y-2")}>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Evaluations</h2>
          <p className={cn("text-xs")}>your drafts will live here</p>
        </div>
        <CreateEvaluation />
      </PageHeader>
      <EvaluationCards evaluations={evaluations} />
    </main>
  );
}
