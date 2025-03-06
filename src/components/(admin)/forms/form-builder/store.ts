import {
  isChoiceItem,
  isRangeItem,
  TChoiceItemSchema,
  TFormBuilderSettingsSchema,
  TFormItemSchema,
  THeaderItemSchema,
  TParagraphItemSchema,
  TRangeItemSchema,
  TWrittenItemSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { v4 } from 'uuid';
import { create, StateCreator, StoreMutators } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

const createDefaultSingleChoice = (): Omit<TChoiceItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: '',
      pointValue: 0,
      isNa: false,
      position: 1,
    },
  ],
  text: 'Question Text',
  type: 'SINGLE_CHOICE',
});

const createDefaultMultipleChoice = (): Omit<
  TChoiceItemSchema,
  'position'
> => ({
  id: v4(),
  isRequired: true,
  isScored: true,
  options: [
    {
      id: v4(),
      text: '',
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
  text: '',
  type: 'RANGE',
});

const createDefaultWritten = (): Omit<TWrittenItemSchema, 'position'> => ({
  id: v4(),
  isRequired: true,
  text: '',
  type: 'WRITTEN',
});

const createDefaultHeader = (): Omit<THeaderItemSchema, 'position'> => ({
  id: v4(),
  text: '',
  type: 'HEADER',
});

const createDefaultParagraph = (): Omit<TParagraphItemSchema, 'position'> => ({
  id: v4(),
  text: '',
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

export const DEFAULT_SETTINGS: TFormBuilderSettingsSchema = {
  editAccess: 'ME',
  editAccessUserIds: [],
  allowMultipleResponses: true,
  allowResponseRevisions: false,
  allowSaveAndQuit: true,
  enableScoring: true,
  passingCriteria: [],
};

type SliceCreator<
  T, // Combined state type (intersection of all slices)
  S, // S represents the specific slice type being created
  Middlewares extends [keyof StoreMutators<unknown, unknown>, unknown][] = [
    ['zustand/devtools', never],
    ['zustand/subscribeWithSelector', never],
  ],
> = StateCreator<
  T,
  Middlewares,
  [],
  S // This represents the slice you're creating
>;

// TODO LATER: Split up state into slices.

interface IFormDetailsSlice {
  title: string;
  settings: TFormBuilderSettingsSchema;
  setTitle: (title: string) => void;
  setSettings: (settings: TFormBuilderSettingsSchema) => void;
}

interface IFormItemsSlice {
  itemIds: string[];
  itemsById: Record<string, Omit<TFormItemSchema, 'id'>>;
  setItems: (items: TFormItemSchema[]) => void;
  addItem: (item: TFormItemSchema) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TFormItemSchema>) => void;
  getItemById: (id: string) => Omit<TFormItemSchema, 'id'> | undefined;
}

interface IDragAndDropSlice {
  activeItemId: string | null;
  selectedItemId: string | null;
  itemDropIndex: number | null;
  setActiveItemId: (id: string | null) => void;
  setSelectedItemId: (id: string | null) => void;
  setItemDropIndex: (index: number | null) => void;
}

type Store = IFormDetailsSlice & IFormItemsSlice & IDragAndDropSlice;

const createFormDetailsSlice: SliceCreator<Store, IFormDetailsSlice> = (
  set,
) => ({
  title: '',
  settings: DEFAULT_SETTINGS,
  setTitle: (title) => set({ title }),
  setSettings: (settings) => set({ settings }),
});

const createFormItemsSlice: SliceCreator<Store, IFormItemsSlice> = (
  set,
  get,
) => ({
  itemIds: [],
  itemsById: {}, // Object, not array
  setItems: (items) =>
    set((state) => {
      const itemIds = items.map((item) => item.id);
      const itemsById = items.reduce(
        (acc: Record<string, TFormItemSchema>, item) => {
          acc[item.id] = item;
          return acc;
        },
        {},
      );
      return {
        ...state,
        itemIds,
        itemsById,
      };
    }),
  addItem: (item) =>
    set((state) => ({
      ...state,
      itemIds: [...state.itemIds, item.id],
      itemsById: { ...state.itemsById, [item.id]: item },
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      ...state,
      itemsById: {
        ...state.itemsById,
        [id]: { ...state.itemsById[id], ...updates },
      },
    })),
  removeItem: (id) =>
    set((state) => {
      const newItemsById = { ...state.itemsById };
      delete newItemsById[id];

      return {
        ...state,
        itemIds: state.itemIds.filter((itemId) => itemId !== id),
        itemsById: newItemsById,
      };
    }),
  getItemById: (id) => get().itemsById[id],
});

const createDragAndDropSlice: SliceCreator<Store, IDragAndDropSlice> = (
  set,
) => ({
  activeItemId: null,
  itemDropIndex: null,
  selectedItemId: null,
  setActiveItemId: (id) => set({ activeItemId: id }),
  setItemDropIndex: (index) => set({ itemDropIndex: index }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
});

export const useFormBuilderStore2 = create<Store>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createFormDetailsSlice(...a),
      ...createFormItemsSlice(...a),
      ...createDragAndDropSlice(...a),
    })),
    { name: 'FormBuilderStore2' },
  ),
);

export interface FormBuilderState {
  isInitialized: boolean;
  setIsInitialized: (val: boolean) => void;

  // other
  id: string | null;
  title: string;
  setTitle: (title: string) => void;

  // settings
  settings: TFormBuilderSettingsSchema;
  setSettings: (data: TFormBuilderSettingsSchema) => void;

  items: TFormItemSchema[];
  setItems: (items: TFormItemSchema[]) => void;
  reorderItems: (ids: string[]) => void;

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
}

// Helper function to update positions based on array order
const updatePositions = (items: TFormItemSchema[]): TFormItemSchema[] =>
  items.map((item, index) => ({
    ...item,
    position: index + 1, // Position is 1-based
  }));

export const useFormBuilderStore = create<FormBuilderState>()(
  devtools(
    subscribeWithSelector((set) => ({
      isInitialized: false,
      id: null,
      setIsInitialized: (val) => set({ isInitialized: val }),
      title: '',
      setTitle: (title) => set({ title }),
      settings: DEFAULT_SETTINGS,
      setSettings: (settings) => set({ settings }),
      items: [],
      activeItemId: null,
      itemDropIndex: null,
      selectedItemId: null,
      setSelectedItemId: (selectedItemId) => set({ selectedItemId }),

      // Set items from API data
      setItems: (items) => set({ items }),

      // Reorder items with position updates
      reorderItems: (ids) =>
        set((state) => {
          // Create a mapping of id -> item for quick lookup
          const itemMap = state.items.reduce(
            (acc: Record<string, TFormItemSchema>, item) => {
              acc[item.id] = item;
              return acc;
            },
            {},
          );

          // Create a new array of items ordered according to the ids
          const reorderedItems = ids.map((id) => itemMap[id]);

          // Update positions based on new order
          return { items: updatePositions(reorderedItems) };
        }),

      setActiveItemId: (activeItemId) => set({ activeItemId }),

      // Add item with proper position updates
      addItem: (type, index) =>
        set((state) => {
          const insertIndex = index ?? state.items.length;
          const newItems = [...state.items];

          // Insert with temporary position
          newItems.splice(insertIndex, 0, {
            ...DEFAULT_NEW_FORM_ITEMS[type](),
            position: insertIndex + 1, // Initial position
          });

          // Update all positions to ensure consistency
          return { items: updatePositions(newItems), itemDropIndex: null };
        }),

      // Duplicate item with proper position updates
      duplicateItem: (id) =>
        set((state) => {
          const itemToCopy = state.items.find((i) => i.id === id);
          const insertIndex = state.items.findIndex((i) => i.id === id) + 1;
          if (!itemToCopy) throw new Error('Item to copy not found');

          const newItems = [...state.items];

          // If it has options, we need to create new ids for those as well
          if (isChoiceItem(itemToCopy)) {
            const newItem = {
              ...itemToCopy,
              id: v4(),
              position: insertIndex + 1, // Initial position
              options: itemToCopy.options.map((option) => ({
                ...option,
                id: v4(), // Create new UUID for each option
              })),
            };

            newItems.splice(insertIndex, 0, newItem);
          } else {
            const newId = v4();
            const newItem = {
              ...itemToCopy,
              id: newId,
              position: insertIndex + 1, // Initial position
            };
            newItems.splice(insertIndex, 0, newItem);
          }

          // Update all positions to ensure consistency
          return { items: updatePositions(newItems) };
        }),

      // Remove item with proper position updates
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);

          // Update positions after removal
          const updatedItems = updatePositions(newItems);

          if (state.selectedItemId === id) {
            return {
              items: updatedItems,
              selectedItemId: null,
            };
          }
          return { items: updatedItems };
        }),

      setItemDropIndex: (idx) => set(() => ({ itemDropIndex: idx })),

      // Update item without changing positions
      updateItem: (id, updater) =>
        set((state) => {
          const index = state.items.findIndex((i) => i.id === id);
          if (index === -1) throw new Error('Item to update not found');
          const newItems = [...state.items];
          newItems[index] = updater(newItems[index]);
          return { items: newItems };
        }),

      // Rest of your functions without changes...
      addMilestone: (itemId, milestoneId) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              if (isRangeItem(item) || isChoiceItem(item)) {
                return {
                  ...item,
                  milestoneIds: [...(item.milestoneIds || []), milestoneId],
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
    })),
    { name: 'FormBuilder Store', trace: true },
  ),
);
