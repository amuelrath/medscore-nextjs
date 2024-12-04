import {
  TChoiceItemSchema,
  TFormItemSchema,
  THeaderItemSchema,
  TParagraphItemSchema,
  TRangeItemSchema,
  TWrittenItemSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const DEFAULT_FORM_ITEMS: TFormItemSchema[] = [
  {
    id: '277affed-4419-4809-a868-063d988a6c6c',
    type: 'SINGLE_CHOICE',
    text: 'Test Question 1: Single Choice',
    options: [
      {
        id: '261394f4-9ce5-4820-86fc-d0c773ba0be3',
        text: 'Option 1',
        pointValue: 0,
        isNa: false,
      },
      {
        id: '261394f4-9cn5-4820-86fc-d0c773ba0be3',
        text: 'Option 1',
        pointValue: 0,
        isNa: false,
      },
    ],
    isScored: true,
    isRequired: true,
    milestoneIds: [],
  },
  {
    id: '277affed-4469-4809-a868-063d988a6c6c',
    type: 'RANGE',
    text: 'Test Question 2: Range',
    maxValue: 7,
    minValue: 0,
    isScored: true,
    isRequired: true,
    milestoneIds: [],
  },
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

const createDefaultSingleChoice = (): TChoiceItemSchema => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: 'Option 1',
      pointValue: 0,
      isNa: false,
    },
  ],
  text: 'Question Text',
  type: 'SINGLE_CHOICE',
});

const createDefaultMultipleChoice = (): TChoiceItemSchema => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: 'Option 1',
      pointValue: 0,
      isNa: false,
    },
  ],
  text: 'Question Text',
  type: 'MULTIPLE_CHOICE',
});

const createDefaultRange = (): TRangeItemSchema => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  minValue: 0,
  maxValue: 7,
  text: 'Question Text',
  type: 'RANGE',
});

const createDefaultWritten = (): TWrittenItemSchema => ({
  id: v4(),
  isRequired: true,
  text: 'Question Text',
  type: 'WRITTEN',
});

const createDefaultHeader = (): THeaderItemSchema => ({
  id: v4(),
  text: 'Header Text',
  type: 'HEADER',
});

const createDefaultParagraph = (): TParagraphItemSchema => ({
  id: v4(),
  text: 'Paragraph Text',
  type: 'PARAGRAPH',
});

const DEFAULT_NEW_FORM_ITEMS = {
  WRITTEN: createDefaultWritten,
  SINGLE_CHOICE: createDefaultSingleChoice,
  MULTIPLE_CHOICE: createDefaultMultipleChoice,
  RANGE: createDefaultRange,
  HEADER: createDefaultHeader,
  PARAGRAPH: createDefaultParagraph,
};

export interface FormBuilderState {
  items: TFormItemSchema[];
  setItems: (items: TFormItemSchema[]) => void;

  // for question selection / detail viewing
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;

  // for question drag and drop
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;

  // for figuring out where a new question should be added
  itemDropIndex: number | null;
  setItemDropIndex: (idx: number | null) => void;

  // managing a question
  addItem: (type: TFormItemSchema['type'], index: number) => void;
  removeItem: (id: string) => void;
  duplicateItem: (itemId: string) => void;
  updateItem: (
    id: string,
    updater: (item: TFormItemSchema) => TFormItemSchema,
  ) => void;

  // managing options
  addOption: (itemId: string, option: { id: string; text: string }) => void;
  removeOption: (itemId: string, optionId: string) => void;
  updateOption: (itemId: string, optionId: string, newText: string) => void;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  devtools(
    (set) => ({
      items: DEFAULT_FORM_ITEMS,
      activeItemId: null,
      itemDropIndex: null,
      selectedItemId: null,
      setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
      setItems: (items) => set({ items }),
      setActiveItemId: (activeItemId) => set({ activeItemId }),
      addItem: (type, index) =>
        set((state) => {
          const insertIndex = index ?? state.items.length;
          const newItems = [...state.items];
          newItems.splice(insertIndex, 0, DEFAULT_NEW_FORM_ITEMS[type]());
          return { items: newItems, insertIndex: null };
        }),
      duplicateItem: (id) =>
        set((state) => {
          const itemToCopy = state.items.find((i) => i.id === id);
          const insertIndex = state.items.findIndex((i) => i.id === id) + 1;
          if (!itemToCopy) throw new Error('Item to copy not found');

          const newId = v4();
          const newItem = {
            ...itemToCopy,
            id: newId,
          };
          const newItems = [...state.items];
          newItems.splice(insertIndex, 0, newItem);
          return { items: newItems };
        }),
      removeItem: (id) =>
        set((state) => {
          if (state.selectedItemId === id) {
            return {
              items: state.items.filter((i) => i.id !== id),
              selectedItemId: null,
            };
          }
          return { items: state.items.filter((i) => i.id !== id) };
        }),
      setItemDropIndex: (idx) => set(() => ({ itemDropIndex: idx })),
      updateItem: (id, updater) =>
        set((state) => {
          const index = state.items.findIndex((i) => i.id === id);
          if (index === -1) throw new Error('Item to update not found');
          const newItems = [...state.items];
          newItems[index] = updater(newItems[index]);
          return { items: newItems };
        }),
      addOption: (itemId, option) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (
                item.type === 'MULTIPLE_CHOICE' ||
                item.type === 'SINGLE_CHOICE'
              ) {
                return {
                  ...item,
                  options: [...(item as TChoiceItemSchema).options, option],
                } as TChoiceItemSchema;
              }
            }
            return item;
          });

          return { items: updatedItems };
        }),
      removeOption: (itemId, optionId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && 'options' in item
              ? {
                  ...item,
                  options: item.options.filter((opt) => opt.id !== optionId),
                }
              : item,
          ),
        })),
      updateOption: (itemId, optionId, newText) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && 'options' in item
              ? {
                  ...item,
                  options: item.options.map((opt) =>
                    opt.id === optionId ? { ...opt, text: newText } : opt,
                  ),
                }
              : item,
          ),
        })),
    }),
    { name: 'FormBuilder Store' },
  ),
);
