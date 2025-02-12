import { z } from 'zod';
import * as React from 'react';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { Active } from '@dnd-kit/core';

export const ZBaseFormItemSchema = z.object({
  id: z.string().uuid().describe("The Form Item's ID"),
  text: z.string(),
  position: z.number()
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

export const ZFormBuilderSchema = z.object({
  id: z.string().uuid().describe("The Form's ID"),
  title: z.string().describe("The Form's Title"),
  formItems: z.array(
    z.union([
      ZWrittenQuestionSchema,
      ZChoiceQuestionSchema,
      ZRangeQuestionSchema,
      ZHeaderSchema,
      ZParagraphSchema,
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

// Type Guards

export function isChoiceItem(item: TFormItemSchema | undefined): item is TChoiceItemSchema {
  return item?.type === "SINGLE_CHOICE" || item?.type === "MULTIPLE_CHOICE"
}

export function isWrittenItem(item: TFormItemSchema | undefined): item is TWrittenItemSchema {
  return item?.type === "WRITTEN"
}

export function isRangeItem(item: TFormItemSchema | undefined): item is TRangeItemSchema {
  return item?.type === "RANGE"
}


// Other jazz

export interface DragOverlayState {
  isNewFormItem: boolean;
  isExistingFormItem: boolean;
  activeItem?: TFormItemSchema;
  activeIndex: number;
  active: Active | null;
}


// First define the possible types as a union
export type FormItemType =
  | 'RANGE'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'WRITTEN'
  | 'HEADER'
  | 'PARAGRAPH';

// Base configurations
export interface BaseFormItemConfig {
  id: string;
  text: string;
  type: FormItemType;
}

export interface QuestionConfig extends BaseFormItemConfig {
  isRequired: boolean;
  isScored?: boolean;
  milestoneIds?: string[];
}

// Specific configurations
export interface RangeConfig extends QuestionConfig {
  type: 'RANGE';
  minValue: number;
  maxValue: number;
}

export interface ChoiceConfig extends QuestionConfig {
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  options: z.infer<typeof ZOptionSchema>[];
}

export interface WrittenConfig extends QuestionConfig {
  type: 'WRITTEN';
}

export interface HeaderConfig extends BaseFormItemConfig {
  type: 'HEADER';
}

export interface ParagraphConfig extends BaseFormItemConfig {
  type: 'PARAGRAPH';
}

// Now we can define the union type
export type FormItemConfig =
  | RangeConfig
  | ChoiceConfig
  | WrittenConfig
  | HeaderConfig
  | ParagraphConfig;

// Utility type to extract config based on type
export type ConfigForType<T extends FormItemType> = Extract<
  FormItemConfig,
  { type: T }
>;

// Type guard remains the same
export function isConfigOfType<T extends FormItemType>(
  config: FormItemConfig,
  type: T,
): config is ConfigForType<T> {
  return config.type === type;
}

export interface NewFormItemProps {
  itemType: TFormItemSchema['type'];
  label: string;
  isClone?: boolean;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
}