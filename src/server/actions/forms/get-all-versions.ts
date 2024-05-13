"use server";
import { db } from "@/db";
import { TFormVersion } from "@/db/types";

export async function getAllVersions(formId: string): Promise<TFormVersion[]> {
  return db.query.formVersions.findMany({
    where: (version, { eq }) => eq(version.formId, formId),
    with: {
      code: true,
      questions: {
        with: {
          options: true,
          milestones: {
            with: {
              milestone: {
                with: {
                  subcompetencies: {
                    with: {
                      competencies: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        with: {
          answers: true,
          creator: true,
          evaluatee: true,
        },
      },
    },
  });
}
