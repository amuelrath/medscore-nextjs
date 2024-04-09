import { db } from "@/db";
import { cn } from "@/lib/utils";
import EvaluationsViewer from "./components/EvaluationsViewer";
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
    <main className={cn("w-full space-y-2")}>
      <EvaluationsViewer evaluations={evaluations} />
    </main>
  );
}
