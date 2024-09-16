import { z } from 'zod';

export const ZBaseFormItemSchema = z.object({
  id: z.string().uuid().describe("The Form Item's ID"),
  text: z.string(),
});

export const ZOptionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  pointValue: z.number().nullable(),
});

export const ZWrittenQuestionSchema = ZBaseFormItemSchema.extend({
  type: z.literal('WRITTEN'),
  isRequired: z.boolean(),
});

export const ZChoiceQuestionSchema = ZBaseFormItemSchema.extend({
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
  isRequired: z.boolean(),
  isScored: z.boolean(),
  options: z.array(ZOptionSchema),
});

export const ZRangeQuestionSchema = ZBaseFormItemSchema.extend({
  type: z.literal('RANGE'),
  isRequired: z.boolean(),
  isScored: z.boolean(),
  minValue: z.number().min(0),
  maxValue: z.number().max(10),
});

export const ZHeaderSchema = ZBaseFormItemSchema.extend({
  type: z.literal('HEADER'),
  description: z.string().nullable(),
});

export const ZFormBuilderSchema = z.object({
  id: z.string().uuid().describe("The Form's ID"),
  title: z.string().describe("The Form's Title"),
  formItems: z.array(
    z.union([
      ZWrittenQuestionSchema,
      ZChoiceQuestionSchema,
      ZRangeQuestionSchema,
      ZHeaderSchema,
    ]),
  ),
});

export type TFormBuilderSchema = z.infer<typeof ZFormBuilderSchema>;
export type TChoiceQuestionSchema = z.infer<typeof ZChoiceQuestionSchema>;
export type TWrittenQuestionSchema = z.infer<typeof ZWrittenQuestionSchema>;
export type TRangeQuestionSchema = z.infer<typeof ZRangeQuestionSchema>;
export type THeaderSchema = z.infer<typeof ZHeaderSchema>;
