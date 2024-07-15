"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TFormItemType } from "@/db/schema";
import { FormItem } from "@/components/(admin)/forms/editor/form-item";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";
import { v4 } from "uuid";

const DynamicMilestoneMenu = dynamic(
  () =>
    import("@/components/(admin)/forms/editor/question-details-menu").then(
      (mod) => mod.QuestionDetailsMenu,
    ),
  { ssr: false, loading: () => <Loading /> },
);

export function FormBuilder() {
  const { control, getValues } = useFormContext<TFormSchema>();
  const formAreaRef = useRef<HTMLDivElement>(null);
  const {
    fields: formItems,
    append: addItem,
    remove: removeItem,
    insert: insertItem,
  } = useFieldArray({
    control,
    name: "formItems",
  });

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [lastSelectedItemIndex, setLastSelectedItemIndex] = useState<number | null>(null);

  const handleAddQuestion = useCallback((type: TFormItemType) => {
    const newItem = {
      id: v4(),
      options: [],
      text: "",
      type,
      isScored: type !== "HEADER" && type !== "WRITTEN",
      isRequired: type !== "HEADER",
      position: formItems.length + 1,
      milestoneIds: [],
    };

    let newIndex: number;
    if (lastSelectedItemIndex !== null) {
      newIndex = lastSelectedItemIndex + 1;
      insertItem(newIndex, newItem);
    } else {
      newIndex = formItems.length;
      addItem(newItem);
    }

    setSelectedItemIndex(newIndex);
    setLastSelectedItemIndex(newIndex);
  }, [formItems, addItem, insertItem, lastSelectedItemIndex]);

  const handleRemoveItem = useCallback((index: number) => {
    removeItem(index);
    setSelectedItemIndex(null);
    setLastSelectedItemIndex(null);
  }, [removeItem]);

  const handleDuplicateItem = useCallback(
    (index: number) => {
      const currentQuestions = getValues("formItems");
      const questionToDuplicate = currentQuestions[index];
      const newQuestion = {
        ...questionToDuplicate,
        id: v4(),
        position: currentQuestions.length + 1,
        options: questionToDuplicate.options.map((option) => ({
          ...option,
          id: v4(),
        })),
      };
      const newIndex = index + 1;
      insertItem(newIndex, newQuestion);
      setSelectedItemIndex(newIndex);
      setLastSelectedItemIndex(newIndex);
    },
    [getValues, insertItem]
  );

  const handleSelectItem = useCallback((index: number) => {
    setSelectedItemIndex(index);
    setLastSelectedItemIndex(index);
  }, []);

  const handleDeselectItem = useCallback(() => {
    setSelectedItemIndex(null);
  }, []);

  const handleFormAreaClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === formAreaRef.current) {
        handleDeselectItem();
      }
    },
    [handleDeselectItem]
  );

  const getPosition = (index: number): number => {
    return (
      getValues(`formItems`)
        .filter((_, itemIndex) => itemIndex < index)
        .filter((item) => item.type !== "HEADER").length + 1
    );
  };

  const isSelectedItemHeader = selectedItemIndex !== null && formItems[selectedItemIndex]?.type === "HEADER";

  return (
    <main className="flex flex-row px-2">
      <LazyMotion features={domAnimation}>
        <DynamicMilestoneMenu
          control={control}
          selectedQuestionIndex={selectedItemIndex !== null && !isSelectedItemHeader ? selectedItemIndex : -1}
          open={selectedItemIndex !== null && !isSelectedItemHeader}
          onClose={handleDeselectItem}
          getPosition={getPosition}
        />
        <div
          ref={formAreaRef}
          className="flex w-full flex-grow justify-center overflow-y-scroll"
          onClick={handleFormAreaClick}
        >
          <div className="no-scrollbar h-[87.3vh] w-full max-w-2xl">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto px-4 pb-52"
            >
              <AnimatePresence>
                {formItems.map((item, index) => (
                  <m.div
                    key={item.id}
                    layout
                    layoutId={item.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="my-4 mr-8"
                  >
                    <FormItem
                      item={item}
                      control={control}
                      index={index}
                      removeItem={() => handleRemoveItem(index)}
                      duplicateItem={() => handleDuplicateItem(index)}
                      isSelected={index === selectedItemIndex}
                      showDock={index === lastSelectedItemIndex}
                      selectItem={() => handleSelectItem(index)}
                      deselectItem={handleDeselectItem}
                      addQuestion={handleAddQuestion}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </LazyMotion>
    </main>
  );
}