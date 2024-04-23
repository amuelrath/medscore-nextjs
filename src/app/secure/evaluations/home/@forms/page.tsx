import { db } from "@/db";
import EvaluationsViewer from "./_components/EvaluationsViewer";
import { ClientForm } from "@/db/client-types";
import { and, eq, isNull } from "drizzle-orm";
import { forms } from "@/db/schema";

export default async function SecureEvaluationsHomePage() {
  const formQuery = await db.transaction(async (tx) => {
    const result: ClientForm[] = [];
    const allForms = await tx.query.forms.findMany({
      where: (f, { and, eq, isNull }) => and(isNull(f.deletedAt)),
    });

    let highestVersions = getHighestVersionForms(allForms);
    highestVersions.forEach(async (v) => {
      const form = await tx.query.forms.findFirst({
        where: (f, { eq, and }) =>
          and(eq(f.id, v.id), eq(f.version, v.version)),
        with: {
          programs: {
            with: {
              specialties: true,
            },
          },
          questions: {
            where: (q, { eq, isNull, and }) =>
              and(isNull(q.deletedAt), eq(q.version, v.version)),
            with: {
              milestones: {
                where: (m, { eq, isNull, and }) =>
                  and(eq(m.version, v.version), isNull(m.deletedAt)),
                with: {
                  milestone: true,
                },
              },
              options: {
                where: (o, { eq, isNull, and }) =>
                  and(eq(o.version, v.version), isNull(o.deletedAt)),
              },
            },
          },
        },
      });
      if (form) {
        result.push(form);
      }
    });
    return result;
  });
  return <EvaluationsViewer data={formQuery} />;
}

function getHighestVersionForms(
  allForms: {
    id: string;
    version: number;
    deletedAt: Date | null;
    title: string;
    lastOpenedAt: Date;
    programId: string;
    creatorId: string | null;
  }[]
): { id: string; version: number }[] {
  const highestVersions: { [key: string]: { id: string; version: number } } =
    {};

  allForms.forEach((form) => {
    const { id, version } = form;
    if (!highestVersions[id] || version > highestVersions[id].version) {
      highestVersions[id] = { id, version };
    }
  });

  return Object.values(highestVersions);
}
