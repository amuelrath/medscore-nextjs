import { db } from "@/db";
import EvaluationEditor from "./_components/EvaluationEditor";
import NavBar from "@/components/ui/top-navbar";
import Section from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { SettingsIcon, SaveAllIcon, ArrowsUpFromLineIcon } from "lucide-react";
import EditorToolbar from "./_components/EditorToolbar";
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

  return (
    <>
      <NavBar>
        <NavBar.Heading>
          <NavBar.Title>
            <div className={cn("w-[50rem] cursor-default")}>
              {evaluation.title}
            </div>
          </NavBar.Title>
          <NavBar.Subtitle>
            <EditorToolbar evaluation={evaluation} />
          </NavBar.Subtitle>
        </NavBar.Heading>
      </NavBar>
      <Section>
        <EvaluationEditor evaluation={evaluation} />
      </Section>
    </>
  );
}
