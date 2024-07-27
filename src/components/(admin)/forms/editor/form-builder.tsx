"use client";
import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TFormItemType } from "@/db/schema";
import { FormItem } from "@/components/(admin)/forms/editor/form-item";
import { AddFormItemDock } from "@/components/(admin)/forms/editor/add-form-item-dock";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";
import { v4 } from "uuid";
import { toast } from "sonner";

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

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [lastSelectedItemIndex, setLastSelectedItemIndex] = useState<
    number | null
  >(null);
  const [milestoneDialogOpenIndex, setMilestoneDialogOpenIndex] = useState<
    number | null
  >(null);
  const [dockPosition, setDockPosition] = useState<{
    top: number;
    height: number;
  } | null>({ top: 24, height: 24 });

  const handleAddQuestion = useCallback(
    (type: TFormItemType) => {
      const newItem = {
        id: v4(),
        options: [],
        text: "",
        type,
        isScored: type !== "HEADER" && type !== "WRITTEN",
        isRequired: type !== "HEADER",
        description: type === "HEADER" ? "" : null,
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
    },
    [formItems, addItem, insertItem, lastSelectedItemIndex],
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      if (formItems.length === 1) {
        toast.error("You must have at least one question.");
      } else {
        removeItem(index);
        setSelectedItemIndex(null);
        setLastSelectedItemIndex(null);
        setMilestoneDialogOpenIndex(null);
        setDockPosition(null);
      }
    },
    [removeItem, formItems.length],
  );

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
    [getValues, insertItem],
  );

  const handleSelectItem = useCallback(
    (index: number, offsetTop: number, height: number) => {
      setSelectedItemIndex(index);
      setLastSelectedItemIndex(index);
      setDockPosition({ top: offsetTop, height });

      const selectedItem = formItems[index];
      if (selectedItem && selectedItem.type === "HEADER") {
        // Close the milestone dialog if a header is selected
        setMilestoneDialogOpenIndex(null);
      } else if (milestoneDialogOpenIndex !== null) {
        // If the milestone dialog is open, update its index
        setMilestoneDialogOpenIndex(index);
      }
    },
    [formItems, milestoneDialogOpenIndex],
  );

  const handleToggleMilestoneDialog = useCallback(
    (index: number) => {
      const selectedItem = formItems[index];
      if (selectedItem && selectedItem.type !== "HEADER") {
        setMilestoneDialogOpenIndex((prevIndex) =>
          prevIndex === index ? null : index,
        );
      } else {
        // If it's a header, ensure the milestone dialog is closed
        setMilestoneDialogOpenIndex(null);
      }
    },
    [formItems],
  );

  const handleDeselectItem = useCallback(() => {
    setSelectedItemIndex(null);
  }, []);

  const handleFormAreaClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === formAreaRef.current) {
        handleDeselectItem();
        setMilestoneDialogOpenIndex(null);
      }
    },
    [handleDeselectItem],
  );

  const getPosition = (index: number): number => {
    return (
      getValues(`formItems`)
        .filter((_, itemIndex) => itemIndex < index)
        .filter((item) => item.type !== "HEADER").length + 1
    );
  };

  return (
    <main className="flex justify-center flex-row px-2">
      <LazyMotion features={domAnimation}>
        <DynamicMilestoneMenu
          control={control}
          selectedQuestionIndex={
            milestoneDialogOpenIndex !== null ? milestoneDialogOpenIndex : -1
          }
          open={milestoneDialogOpenIndex !== null}
          onClose={() => setMilestoneDialogOpenIndex(null)}
          getPosition={getPosition}
        />
        <div
          ref={formAreaRef}
          className="flex w-full flex-grow justify-center overflow-y-scroll"
          onClick={handleFormAreaClick}
        >
          <div className="no-scrollbar relative h-[87.3vh] w-full max-w-2xl">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto px-4 pb-52 pt-4"
            >
              <AnimatePresence>
                {formItems.map((item, index) => (
                  <m.div key={item.id} layout="position" layoutId={item.id}>
                    <FormItem
                      key={item.id}
                      item={item}
                      control={control}
                      index={index}
                      removeItem={() => handleRemoveItem(index)}
                      duplicateItem={() => handleDuplicateItem(index)}
                      isSelected={index === selectedItemIndex}
                      selectItem={handleSelectItem}
                      deselectItem={handleDeselectItem}
                      toggleMilestoneDialog={() =>
                        handleToggleMilestoneDialog(index)
                      }
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            </form>
            <AnimatePresence>
              {dockPosition && (
                <m.div
                  key="form-dock"
                  initial={false}
                  animate={{
                    top: dockPosition.top,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    position: "absolute",
                    left: "100%",
                    height: dockPosition.height,
                  }}
                  className="will-change-transform"
                >
                  <AddFormItemDock addQuestion={handleAddQuestion} />
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LazyMotion>
    </main>
  );
}
