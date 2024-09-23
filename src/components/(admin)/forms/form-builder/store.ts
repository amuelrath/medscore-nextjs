import {
  TChoiceQuestionSchema,
  TFormItemSchema,
  THeaderSchema,
  TRangeQuestionSchema,
  TWrittenQuestionSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { v4 } from 'uuid';
import { create } from 'zustand';

const DEFAULT_FORM_ITEMS: TFormItemSchema[] = [
  // {
  //   id: '277affed-4419-4809-a868-063d988a6c6c',
  //   type: 'SINGLE_CHOICE',
  //   text: 'Test Question 1: Single Choice',
  //   options: [
  //     {
  //       id: '261394f4-9ce5-4820-86fc-d0c773ba0be3',
  //       text: 'Option 1',
  //       pointValue: 0,
  //     },
  //     {
  //       id: '261394f4-9cn5-4820-86fc-d0c773ba0be3',
  //       text: 'Option 1',
  //       pointValue: 0,
  //     },
  //   ],
  //   isScored: true,
  //   isRequired: true,
  //   milestoneIds: [],
  // },
  // {
  //   id: '277affed-4469-4809-a868-063d988a6c6c',
  //   type: 'RANGE',
  //   text: 'Test Question 2: Range',
  //   maxValue: 7,
  //   minValue: 0,
  //   isScored: true,
  //   isRequired: true,
  //   milestoneIds: [],
  // },
  {
    id: '977affed-4419-4809-a868-063d988a6c6c',
    type: 'WRITTEN',
    text: 'Test Question 3: Written',
    isRequired: true,
  },
];
const DEFAULT_MILESTONES: { id: string; text: string }[] = [
  {
    id: '00c70422-4e76-491d-bb7f-78aac16076fc',
    text: 'PC 1.1.1',
  },
  {
    id: '07539f73-778b-4c92-bf30-456b4ef47ff4',
    text: 'PC 1.1.2',
  },
  {
    id: '0bf09b3b-8a57-4396-87a8-40dff8f6afed',
    text: 'MK 1.1.1',
  },
  {
    id: '094e8d63-734a-46d6-8785-2fcedf0416ce',
    text: 'ICS 1.1.1',
  },
];
const DEFAULT_SINGLE_CHOICE: TChoiceQuestionSchema = {
  id: (() => v4())(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: (() => v4())(),
      text: 'Option 1',
      pointValue: 0,
    },
  ],
  text: 'Question Text',
  type: 'SINGLE_CHOICE',
};
const DEFAULT_MULTIPLE_CHOICE: TChoiceQuestionSchema = {
  id: (() => v4())(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: (() => v4())(),
      text: 'Option 1',
      pointValue: 0,
    },
  ],
  text: 'Question Text',
  type: 'MULTIPLE_CHOICE',
};
const DEFAULT_RANGE: TRangeQuestionSchema = {
  id: (() => v4())(),
  isRequired: true,
  isScored: true,
  minValue: 0,
  maxValue: 7,
  text: 'Question Text',
  type: 'RANGE',
};
const DEFAULT_WRITTEN: TWrittenQuestionSchema = {
  id: (() => v4())(),
  isRequired: true,
  text: 'Question Text',
  type: 'WRITTEN',
};
const DEFAULT_HEADER: THeaderSchema = {
  id: (() => v4())(),
  text: 'Header Text',
  description: null,
  type: 'HEADER',
};

const DEFAULT_NEW_FORM_ITEMS = {
  WRITTEN: DEFAULT_WRITTEN,
  SINGLE_CHOICE: DEFAULT_SINGLE_CHOICE,
  MULTIPLE_CHOICE: DEFAULT_MULTIPLE_CHOICE,
  RANGE: DEFAULT_RANGE,
  HEADER: DEFAULT_HEADER,
};

export interface TestItem {
  id: string;
  text?: string;
}

export interface FormBuilderState {
  items: TestItem[];
  activeItemId: string | null;
  setItems: (items: TestItem[]) => void;
  setActiveItemId: (id: string | null) => void;
  addItem: (newItem: TestItem, index: number) => void;
  removeItem: (id: string) => void;
  itemDropIndex: number | null;
  setItemDropIndex: (idx: number | null) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  items: [
    { id: v4(), text: 'A' },
    { id: v4(), text: 'B' },
    { id: v4(), text: 'C' },
  ],
  activeItemId: null,
  itemDropIndex: null,
  setItems: (items) => set({ items }),
  setActiveItemId: (activeItemId) => set({ activeItemId }),
  addItem: (newItem, index) =>
    set((state) => {
      const insertIndex = index ?? state.items.length;
      const newItems = [...state.items];
      newItems.splice(insertIndex, 0, newItem);
      return { items: newItems, insertIndex: null };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setItemDropIndex: (idx) =>
    set(() => ({ itemDropIndex: idx })),
}));
