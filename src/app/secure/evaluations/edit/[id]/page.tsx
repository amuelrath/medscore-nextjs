import PageHeader from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/db";
import EvaluationEditor from "./components/EvaluationEditor";
import { competencies, specialties } from "@/db/schema";

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
    <main>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Untitled Evaluation</h2>
          <Breadcrumbs />
        </div>
      </PageHeader>
      <EvaluationEditor evaluation={evaluation} />
    </main>
  );
}

function Breadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/secure/evaluations">
            evaluations
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">editor</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
