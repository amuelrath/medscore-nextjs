"use server";
import { db } from "@/db";
import { NonNullable } from "@/server/actions/forms/get-one-form";
import { DateToString } from "@/db/utils";

export async function getOneVersion(formVersionId: string) {
  return db.query.formVersions.findFirst({
    where: (version, { eq }) => eq(version.id, formVersionId),
    with: {
      code: true,
      questions: {
        with: {
          options: true,
          milestones: {
            with: {
              milestone: true,
            },
          },
        },
      },
      responses: {
        with: {
          creator: true,
          answers: true,
          evaluatee: true,
        },
      },
    },
  });
}

export type FormVersionResult = NonNullable<
  DateToString<Awaited<ReturnType<typeof getOneVersion>>>
>;
