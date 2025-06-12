import { z } from 'zod';

export const ZBaseFormItemSchema = z.object({
  id: z.string().uuid().describe("The Form Item's ID"),
  text: z.string(),
  position: z.number(),
});
export const ZOptionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  pointValue: z.number().nullable(),
  isNa: z.boolean(),
  position: z.number(),
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
  milestoneIds: z.array(z.string().uuid()).optional(),
});
export const ZRangeQuestionSchema = ZBaseFormItemSchema.extend({
  type: z.literal('RANGE'),
  isRequired: z.boolean(),
  isScored: z.boolean(),
  minValue: z.number().min(0),
  maxValue: z.number().max(10),
  milestoneIds: z.array(z.string().uuid()).optional(),
});
export const ZHeaderSchema = ZBaseFormItemSchema.extend({
  type: z.literal('HEADER'),
});
export const ZParagraphSchema = ZBaseFormItemSchema.extend({
  type: z.literal('PARAGRAPH'),
});
export const ZFormItemSchema = z.union([
  ZWrittenQuestionSchema,
  ZChoiceQuestionSchema,
  ZRangeQuestionSchema,
  ZHeaderSchema,
  ZParagraphSchema,
]);
