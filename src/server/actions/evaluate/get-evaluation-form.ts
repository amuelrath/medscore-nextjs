"use server";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAfter, isBefore } from "date-fns";

export async function getEvaluationForm({
  responseId,
}: {
  responseId: string;
}) {
  console.log("Received responseId:", responseId);
  const now = new Date()
  const response = await db.query.responses.findFirst({
    where: eq(responses.id, responseId),
    with: {
      // todo use session instead of this when we have auth done
      creator: {
        columns: {
          id: true,
          role: true,
          email: true,
          password: false,
          firstName: true,
          lastName: true,
        },
      },
      assessment: {
        with: {
          form: {
            columns: {
              id: true,
              title: false,
              programId: false,
              creatorId: false,
              lastOpenedAt: false,
            },
          },
        },
      },
    },
  });

  if (!response) throw new Error("Form code not found");

  if (
    isBefore(now, response.assessment.startsAt) ||
    isAfter(now, response.assessment.expiresAt) ||
    response.assessment.canceledAt
  )
    throw new Error("Form code has expired or not yet valid");

  const form = await db.query.forms.findFirst({
    where: (f, { eq }) => eq(f.id, response.assessment.formId),
    columns: {
      id: true,
      title: true,
    },
    with: {
      assessments: {
        limit: 1,
        where: (fc, { eq }) => eq(fc.id, response.assessment.id),
        columns: {
          formId: false,
          code: false,
          id: false,
          title: false,
          isDirectObservation: true,
          canceledAt: true,
          startsAt: true,
          expiresAt: true,
          createdAt: false,
        },
        with: {
          evaluatees: {
            columns: {
              userId: false,
              assessmentId: false,
              deletedAt: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  email: false,
                  password: false,
                },
              },
            },
          },
        },
      },
      formItems: {
        columns: {
          id: true,
          type: true,
          description: true,
          position: true,
          text: true,
          isRequired: true,
        },
        with: {
          options: {
            columns: {
              id: true,
              formItemId: true,
              isNa: true,
              text: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!form) throw new Error("form not found");

  return { form, response };
}

export type EvaluationFormResult = Awaited<
  ReturnType<typeof getEvaluationForm>
>;
