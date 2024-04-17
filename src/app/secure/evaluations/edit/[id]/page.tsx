import { db } from "@/db";
import EvaluationEditor from "./_components/Editor";
import { EvaluationFormData, ClientEvaluation } from "@/db/client-types";
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

  const morphedEvaluation = morphClientEvaluationToFormData(evaluation);
  const subcompetencies = evaluation.programs.specialties?.subcompetencies;

  return (
    <EvaluationEditor
      defaultValues={morphedEvaluation}
      subcompetencies={subcompetencies || []}
    />
  );
}

function morphClientEvaluationToFormData(
  clientEvaluation: ClientEvaluation
): EvaluationFormData {
  const evaluation: EvaluationFormData = {
    id: clientEvaluation.id as string,
    title: clientEvaluation.title as string,
    programId: clientEvaluation.programId as string,
    questions: clientEvaluation.questions.map((question) => ({
      id: question.id as string,
      position: question.position as number,
      text: question.text as string,
      feedback: question.feedback as boolean,
      milestoneIds: question.milestones.map((m) => m.milestoneId) as string[],
      options: question.options.map((option) => ({
        id: option.id as string,
        position: option.position as number,
        text: option.text as string,
        pointValue: Number(option.pointValue),
      })),
    })),
  };

  return evaluation;
}
