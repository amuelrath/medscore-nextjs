import { db } from "@/db";
import EvaluationsViewer from "./_components/EvaluationsViewer";
export default async function SecureEvaluationsHomePage() {
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

  return <EvaluationsViewer evaluations={evaluations} />;
}
