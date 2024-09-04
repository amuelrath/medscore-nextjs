'use server';

import { TEvaluationForm } from '@/components/(evaluation)/evaluation-form/schemas';
import { db } from '@/db';
import { answerOptions, answers, responses } from '@/db/schema';
import { MedscoreDatabase } from '@/types';
import { eq } from 'drizzle-orm';

function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

function compareOptions(
  formAnswer: TEvaluationForm['answers'][number],
  existingOptionIds: string[],
): boolean {
  if (formAnswer.type === 'MULTIPLE_CHOICE') {
    return !arraysEqual(formAnswer.selectedOptionIds || [], existingOptionIds);
  }
  if (formAnswer.type === 'SINGLE_CHOICE') {
    return formAnswer.selectedOptionId !== (existingOptionIds[0] || null);
  }
  return false;
}

function hasOptionChanged(
  formAnswer: TEvaluationForm['answers'][number],
  existingAnswer:
    | (typeof answers.$inferSelect & {
        answerOptions: (typeof answerOptions.$inferSelect)[];
      })
    | undefined,
): boolean {
  if (!existingAnswer) return true;
  const existingOptionIds = existingAnswer.answerOptions.map(
    (ao) => ao.optionId,
  );
  return compareOptions(formAnswer, existingOptionIds);
}

function hasAnswerChanged(
  formAnswer: TEvaluationForm['answers'][number],
  existingAnswer:
    | (typeof answers.$inferSelect & {
        answerOptions: (typeof answerOptions.$inferSelect)[];
      })
    | undefined,
): boolean {
  if (!existingAnswer) return true;
  if (formAnswer.textValue !== existingAnswer.textValue) return true;
  return hasOptionChanged(formAnswer, existingAnswer);
}

async function syncAnswerOptions(
  formAnswer: TEvaluationForm['answers'][number],
  existingAnswer:
    | (typeof answers.$inferSelect & {
        answerOptions: (typeof answerOptions.$inferSelect)[];
      })
    | undefined,
  tx: MedscoreDatabase,
): Promise<void> {
  if (!hasOptionChanged(formAnswer, existingAnswer)) return;

  await tx
    .delete(answerOptions)
    .where(eq(answerOptions.answerId, formAnswer.id));

  if (
    formAnswer.type === 'MULTIPLE_CHOICE' &&
    formAnswer.selectedOptionIds &&
    formAnswer.selectedOptionIds.length > 0
  ) {
    await tx.insert(answerOptions).values(
      formAnswer.selectedOptionIds.map((optionId) => ({
        answerId: formAnswer.id,
        optionId,
      })),
    );
  } else if (
    formAnswer.type === 'SINGLE_CHOICE' &&
    formAnswer.selectedOptionId
  ) {
    await tx.insert(answerOptions).values({
      answerId: formAnswer.id,
      optionId: formAnswer.selectedOptionId,
    });
  }
}

export async function saveResponse(formData: TEvaluationForm): Promise<void> {
  await db.transaction(async (tx) => {
    const existingFormData = await tx.query.responses.findFirst({
      where: eq(responses.id, formData.id),
      with: {
        answers: {
          with: {
            answerOptions: true,
          },
        },
      },
    });

    const updatePromises = formData.answers.map(async (formAnswer) => {
      const existingAnswer = existingFormData?.answers.find(
        (a) => a.id === formAnswer.id,
      );

      if (hasAnswerChanged(formAnswer, existingAnswer)) {
        await tx
          .insert(answers)
          .values({
            id: formAnswer.id,
            textValue: formAnswer.textValue,
            responseId: formData.id,
            formItemId: formAnswer.formItemId,
          })
          .onConflictDoUpdate({
            target: answers.id,
            set: { textValue: formAnswer.textValue },
          });

        await syncAnswerOptions(formAnswer, existingAnswer, tx);
      }
    });

    await Promise.all(updatePromises);
  });
}
