import { ZFormBuilderSchema } from '@/features/form-builder/schemas/form-builder-schemas';
import {
  ZChoiceQuestionSchema,
  ZHeaderSchema,
  ZOptionSchema,
  ZParagraphSchema,
  ZRangeQuestionSchema,
  ZWrittenQuestionSchema,
} from '@/features/form-builder/schemas/form-item-schemas';
import { ZFormBuilderSettingsSchema } from '@/features/form-builder/schemas/settings-schemas';
import { Active } from '@dnd-kit/core';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { z } from 'zod';

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
  options: TOptionSchema;
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
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}
