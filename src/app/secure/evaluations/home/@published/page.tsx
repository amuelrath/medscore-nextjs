import { db } from "@/db";
import PublishedEvaluationsViewer from "./components/PublishedEvaluationsViewer";
export default async function SecureEvaluationsHomePage() {
  const evaluations = await db.query.publishedEvaluations.findMany({
    with: {
      programs: {
        with: {
          specialties: {
            with: {
              subcompetencies: {
                with: {
                  milestones: true,
                  competencies: true,
                },
              },
            },
          },
        },
      },
      questions: {
        with: {
          options: true,
          milestones: true,
        },
      },
    },
  });

  return <PublishedEvaluationsViewer evaluations={evaluations} />;
}
