import { Active } from '@dnd-kit/core';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import * as React from 'react';
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

export const ZPassingCriteriaSchema = z.array(
  z.object({
    subcompetencyId: z.string().uuid(),
    threshold: z.number().min(0).max(1),
    levelThresholds: z.array(
      z.object({
        level: z.number().int().min(1).max(5),
        threshold: z.number().min(0).max(1),
      }),
    ),
  }),
);

export const ZRoleWeightSchema = z.array(
  z.object({
    roleId: z.string().uuid(),
    weight: z.number()
  })
)

export const ZFormBuilderSettingsSchema = z
  .object({
    editAccess: z.union([
      z.literal('ME'),
      z.literal('FACULTY'),
      z.literal('CUSTOM'),
    ]),
    editAccessUserIds: z.array(z.string().uuid()).optional(),
    allowMultipleResponses: z.boolean(),
    allowResponseRevisions: z.boolean(),
    allowSaveAndQuit: z.boolean(),
    enableScoring: z.boolean(),
    passingCriteria: ZPassingCriteriaSchema,
  })
  .refine((data) => {
    // if we have custom editors selected, there must be ids
    if (data.editAccess !== 'CUSTOM') return true;
    if ((data.editAccessUserIds?.length || 0) < 1)
      return { message: 'Must have at least one allowed editor.' };
  });

export const ZFormItemSchema = z.union([
  ZWrittenQuestionSchema,
  ZChoiceQuestionSchema,
  ZRangeQuestionSchema,
  ZHeaderSchema,
  ZParagraphSchema,
]);

export const ZFormBuilderSchema = z.object({
  id: z.string().uuid().describe("The Form's ID"),
  title: z.string().describe("The Form's Title"),
  settings: ZFormBuilderSettingsSchema,
  formItems: z.array(ZFormItemSchema),
});

export type TFormBuilderSchema = z.infer<typeof ZFormBuilderSchema>;
export type TFormBuilderSettingsSchema = z.infer<
  typeof ZFormBuilderSettingsSchema
>;
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

export function isChoiceItem(
  item: TFormItemSchema | undefined,
): item is TChoiceItemSchema {
  return item?.type === 'SINGLE_CHOICE' || item?.type === 'MULTIPLE_CHOICE';
}

export function isWrittenItem(
  item: TFormItemSchema | undefined,
): item is TWrittenItemSchema {
  return item?.type === 'WRITTEN';
}

export function isRangeItem(
  item: TFormItemSchema | undefined,
): item is TRangeItemSchema {
  return item?.type === 'RANGE';
}

// Other jazz

export interface DragOverlayState {
  isNewFormItem: boolean;
  isExistingFormItem: boolean;
  activeItem?: string;
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
