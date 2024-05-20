"use server";
import { db } from "@/db";
import { DateToString } from "@/db/utils";

export async function getAllVersions(formId: string) {
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

export type FormVersionsResult = NonNullable<
  DateToString<Awaited<ReturnType<typeof getAllVersions>>>
>;
