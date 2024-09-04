import { EvaluationFormResult } from '@/server/actions/evaluate/get-evaluation-form';
import { v4 } from 'uuid';
import { z } from 'zod';

const ZAnswerBase = z.object({
  id: z.string().uuid(), // Optional for new answers
  formItemId: z.string().uuid(),
  textValue: z.string().nullable().optional(),
});

const ZSingleChoiceAnswer = ZAnswerBase.extend({
  type: z.literal('SINGLE_CHOICE'),
  selectedOptionId: z.string().uuid().nullable().optional(),
});

const ZMultipleChoiceAnswer = ZAnswerBase.extend({
  type: z.literal('MULTIPLE_CHOICE'),
  selectedOptionIds: z.array(z.string().uuid()).optional(),
});

const ZWrittenAnswer = ZAnswerBase.extend({
  type: z.literal('WRITTEN'),
});

const ZAnswer = z.discriminatedUnion('type', [
  ZSingleChoiceAnswer,
  ZMultipleChoiceAnswer,
  ZWrittenAnswer,
]);

export const ZEvaluationFormSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['NOT_STARTED', 'STARTED', 'COMPLETED']),
  duration: z.number().int().optional(),
  answers: z.array(ZAnswer),
});

export type TEvaluationForm = z.infer<typeof ZEvaluationFormSchema>;
export type TAnswer = z.infer<typeof ZAnswer>;

export const transformToSchema = ({
  form,
  response,
}: EvaluationFormResult): TEvaluationForm => {
  const { id: responseId, status, answers } = response;

  const transformedAnswers = form.formItems
    .filter((f) => f.type !== 'HEADER')
    .map((formItem): TAnswer => {
      const existingAnswer = answers.find((a) => a.formItemId === formItem.id);

      if (
        formItem.type !== 'MULTIPLE_CHOICE' &&
        formItem.type !== 'SINGLE_CHOICE' &&
        formItem.type !== 'WRITTEN'
      ) {
        throw new Error(
          `Unsupported form item type: ${formItem.type} for item ID: ${formItem.id}`,
        );
      }

      const baseFields = {
        id: existingAnswer?.id || v4(), // use the existingAnswer's id or generate a new one on the client
        formItemId: formItem.id,
        type: formItem.type,
        textValue: existingAnswer?.textValue ?? null,
      };

      switch (formItem.type) {
        case 'WRITTEN':
          return {
            ...baseFields,
            type: 'WRITTEN',
          };
        case 'SINGLE_CHOICE':
          return {
            ...baseFields,
            type: 'SINGLE_CHOICE',
            selectedOptionId:
              existingAnswer?.answerOptions[0]?.optionId ?? null,
          };
        case 'MULTIPLE_CHOICE':
          return {
            ...baseFields,
            type: 'MULTIPLE_CHOICE',
            selectedOptionIds:
              existingAnswer?.answerOptions.map((o) => o.optionId) ?? [],
          };
        default:
          throw new Error('Encountered Unsupported Question Type!');
      }
    });

  return {
    id: responseId,
    status,
    answers: transformedAnswers,
    duration: response.duration ?? undefined,
  };
};
