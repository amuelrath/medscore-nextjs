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
    .sort((a, b) => a.position - b.position) // not sorting will break the form
    .map((formItem): TAnswer => {
      const existingAnswer = answers.find((a) => a.formItemId === formItem.id);
      const validOptionIds = new Set(formItem.options?.map((o) => o.id) || []);

      const baseFields = {
        id: existingAnswer?.id || v4(),
        formItemId: formItem.id,
        type: formItem.type,
        textValue: existingAnswer?.textValue ?? null,
      };

      if (formItem.type === 'WRITTEN') {
        return {
          ...baseFields,
          type: 'WRITTEN',
        };
      }

      if (formItem.type === 'SINGLE_CHOICE') {
        const selectedOptionId = existingAnswer?.answerOptions[0]?.optionId;
        return {
          ...baseFields,
          type: 'SINGLE_CHOICE',
          selectedOptionId:
            selectedOptionId && validOptionIds.has(selectedOptionId)
              ? selectedOptionId
              : null,
        };
      }

      if (formItem.type === 'MULTIPLE_CHOICE') {
        const selectedOptionIds =
          existingAnswer?.answerOptions.map((o) => o.optionId) ?? [];
        return {
          ...baseFields,
          type: 'MULTIPLE_CHOICE',
          selectedOptionIds: selectedOptionIds.filter((id) =>
            validOptionIds.has(id),
          ),
        };
      }

      throw new Error(
        `Unsupported form item type: ${formItem.type} for item ID: ${formItem.id}`,
      );
    });

  return {
    id: responseId,
    status,
    answers: transformedAnswers,
    duration: response.duration ?? undefined,
  };
};
