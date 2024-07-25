"use client";
import { FC, ReactNode, useEffect } from "react";
import {
  DirectionAwareContent,
  DirectionAwareTabsProvider,
} from "@/components/ui/direction-aware-tabs";
import { FormEditorNav } from "@/components/(admin)/forms/editor/form-editor-nav";
import { useSetAtom } from "jotai";
import {
  selectedAssessmentIdAtom,
  selectedResponseIdAtom,
} from "@/store/form-atoms";

interface FormLayoutProps {
  editor: ReactNode;
  responses: ReactNode;
  formId: string;
}

// separates the tabs and tabs content
export const FormLayout: FC<FormLayoutProps> = ({
  editor,
  responses,
  formId,
}) => {
  const setSelectedResponseId = useSetAtom(selectedResponseIdAtom);
  const setSelectedFormCodeId = useSetAtom(selectedAssessmentIdAtom);

  // clear jotai state
  useEffect(() => {
    setSelectedFormCodeId(undefined);
    setSelectedResponseId(undefined);
  }, [formId, setSelectedFormCodeId, setSelectedResponseId]);

  const tabs = [
    { id: 0, label: "Editor", content: editor },
    { id: 1, label: "Responses", content: responses },
  ];

  return (
    <DirectionAwareTabsProvider tabs={tabs}>
      <div className="flex w-full flex-col overflow-x-hidden">
        <FormEditorNav />
        <DirectionAwareContent />
      </div>
    </DirectionAwareTabsProvider>
  );
};
