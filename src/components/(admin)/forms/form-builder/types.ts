import { z } from 'zod';

export const ZBaseFormItemSchema = z.object({
  id: z.string().uuid().describe("The Form Item's ID"),
  text: z.string(),
});

export const ZOptionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  pointValue: z.number().nullable(),
  isNa: z.boolean(),
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
export type TOptionSchema = z.infer<typeof ZOptionSchema>;
export type TChoiceItemSchema = z.infer<typeof ZChoiceQuestionSchema>;
export type TWrittenItemSchema = z.infer<typeof ZWrittenQuestionSchema>;
export type TRangeItemSchema = z.infer<typeof ZRangeQuestionSchema>;
export type THeaderItemSchema = z.infer<typeof ZHeaderSchema>;
export type TParagraphItemSchema = z.infer<typeof ZParagraphSchema>;
export type TFormItemSchema =
  | TChoiceItemSchema
  | TWrittenItemSchema
  | TRangeItemSchema
  | THeaderItemSchema
  | TParagraphItemSchema;

export function isWritten(item: TFormItemSchema): item is TWrittenItemSchema {
  return item.type === 'WRITTEN';
}

export function isSingleChoice(
  item: TFormItemSchema,
): item is TChoiceItemSchema {
  return item.type === 'SINGLE_CHOICE';
}

export function isHeader(item: TFormItemSchema): item is THeaderItemSchema {
  return item.type === 'HEADER';
}

export function isParagraph(
  item: TFormItemSchema,
): item is TParagraphItemSchema {
  return item.type === 'PARAGRAPH';
}

export function isRange(item: TFormItemSchema): item is TRangeItemSchema {
  return item.type === 'RANGE';
}

export function isMultipleChoice(
  item: TFormItemSchema,
): item is TChoiceItemSchema {
  return item.type === 'MULTIPLE_CHOICE';
}
