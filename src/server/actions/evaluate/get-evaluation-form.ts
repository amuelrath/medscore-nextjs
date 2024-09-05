'use server';

import { db } from '@/db';
import { assessments, forms, responses } from '@/db/schema';
import { isAfter, isBefore } from 'date-fns';
import { eq } from 'drizzle-orm';

export async function getEvaluationForm({
  responseId,
}: {
  responseId: string;
}) {
  const now = new Date();
  const response = await db.query.responses.findFirst({
    where: eq(responses.id, responseId),
    with: {
      answers: {
        with: {
          answerOptions: {
            columns: {
              id: true,
              optionId: true,
            },
          },
        },
      },
      // todo use session instead of this when we have auth done
      respondee: {
        columns: {
          id: true,
          role: true,
          email: true,
          password: false,
          firstName: true,
          lastName: true,
        },
      },
      evaluatee: {
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

  if (!response) throw new Error('Form code not found');

  if (
    isBefore(now, response.assessment.startsAt) ||
    isAfter(now, response.assessment.expiresAt)
  )
    throw new Error('Form code has expired or not yet valid');

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, response.assessment.formId),
    columns: {
      id: true,
      title: true,
      settings: true,
    },
    with: {
      assessments: {
        limit: 1,
        where: eq(assessments.id, response.assessment.id),
        columns: {
          title: true,
          startsAt: true,
          expiresAt: true,
        },
        with: {
          responses: {
            columns: {
              id: true,
              status: true,
              duration: true,
            },
            with: {
              respondee: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
              evaluatee: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
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

  if (!form) throw new Error('form not found');

  return { form, response };
}

export type EvaluationFormResult = Awaited<
  ReturnType<typeof getEvaluationForm>
>;
