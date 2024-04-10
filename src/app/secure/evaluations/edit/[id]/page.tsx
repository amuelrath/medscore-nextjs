import { db } from "@/db";
import EvaluationEditor from "./components/EvaluationEditor";
export default async function EditorPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO CHECK AGAINST SESSION.USER.ID
  const evaluation = await db.query.evaluations.findFirst({
    where: (evaluation, { eq }) => eq(evaluation.id, params.id),
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

  if (evaluation?.creatorId !== process.env.DEV_USER_ID) {
    return new Error("Unauthorized");
  }

  if (!evaluation) {
    return new Error("Evaluation not found");
  }

  return <EvaluationEditor evaluation={evaluation} />;
}
