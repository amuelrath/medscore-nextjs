import {
  isChoiceItem,
  isRangeItem,
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

const createDefaultSingleChoice = (): Omit<TChoiceItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: 'Option 1',
      pointValue: 0,
      isNa: false,
      position: 1,
    },
  ],
  text: 'Question Text',
  type: 'SINGLE_CHOICE',
});

const createDefaultMultipleChoice = (): Omit<TChoiceItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: 'Option 1',
      pointValue: 0,
      isNa: false,
      position: 1,
    },
  ],
  text: 'Question Text',
  type: 'MULTIPLE_CHOICE',
});

const createDefaultRange = (): Omit<TRangeItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  minValue: 0,
  maxValue: 7,
  text: 'Question Text',
  type: 'RANGE',
});

const createDefaultWritten = (): Omit<TWrittenItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  text: 'Question Text',
  type: 'WRITTEN',
});

const createDefaultHeader = (): Omit<THeaderItemSchema, 'position'> => ({
  id: v4(),
  text: 'Header Text',
  type: 'HEADER',
});

const createDefaultParagraph = (): Omit<TParagraphItemSchema, 'position'> => ({
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

  // managing milestones
  addMilestone: (itemId: string, milestoneId: string) => void;
  removeMilestone: (itemId: string, milestoneId: string) => void;

  // managing options
  addOption: (itemId: string, option: { id: string; text: string }) => void;
  removeOption: (itemId: string, optionId: string) => void;
  updateOption: (
    itemId: string,
    optionId: string,
    newText?: string,
    newPointValue?: number,
  ) => void;

  // manage overall state
}

export const useFormBuilderStore = create<FormBuilderState>()(
  devtools(
    (set) => ({
      items: [],
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
          newItems.splice(insertIndex, 0, { ...DEFAULT_NEW_FORM_ITEMS[type](), position: state.items.length + 1});
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
      addMilestone: (itemId, milestoneId) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (isRangeItem(item) || isChoiceItem(item)) {
                return {
                  ...item,
                  milestoneIds: [...(item.milestoneIds || ''), milestoneId],
                };
              }
            }
            return item;
          });

          return { items: updatedItems };
        }),
      removeMilestone: (itemId, milestoneId) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (isRangeItem(item) || isChoiceItem(item)) {
                return {
                  ...item,
                  milestoneIds: [
                    ...(item.milestoneIds?.filter((m) => m !== milestoneId) ||
                      []),
                  ],
                };
              }
            }
            return item;
          });

          return { items: updatedItems };
        }),
      addOption: (itemId, option) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (isChoiceItem(item)) {
                return {
                  ...item,
                  options: [
                    ...item.options,
                    {
                      ...option,
                      isNa: false,
                      pointValue: 0,
                      position: item.options.length + 1,
                    },
                  ],
                };
              }
            }
            return item;
          });

          return { items: updatedItems };
        }),
      removeOption: (itemId, optionId) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (isChoiceItem(item)) {
                return {
                  ...item,
                  options: [...item.options.filter((o) => o.id !== optionId)],
                };
              }
            }
            return item;
          });

          return { items: updatedItems };
        }),
      updateOption: (itemId, optionId, newText, newPointValue) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && isChoiceItem(item)
              ? {
                  ...item,
                  options: item.options.map((opt) =>
                    opt.id === optionId
                      ? {
                          ...opt,
                          text: newText ?? opt.text,
                          pointValue: newPointValue ?? opt.pointValue,
                        }
                      : opt,
                  ),
                }
              : item,
          ),
        })),
    }),
    { name: 'FormBuilder Store' },
  ),
);
