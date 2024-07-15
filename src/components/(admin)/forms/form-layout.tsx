import { FC, ReactNode } from "react";
import {
  DirectionAwareContent,
  DirectionAwareTabsProvider,
} from "@/components/ui/direction-aware-tabs";
import { FormEditorNav } from "@/components/(admin)/forms/editor/form-editor-nav";

interface FormLayoutProps {
  editor: ReactNode;
  responses: ReactNode;
}

// separates the tabs and tabs content
export const FormLayout: FC<FormLayoutProps> = ({ editor, responses }) => {
  const tabs = [
    { id: 0, label: "Editor", content: editor },
    { id: 1, label: "Responses", content: responses },
  ];

  return (
    <DirectionAwareTabsProvider tabs={tabs}>
      <div className="flex w-full flex-col">
        <FormEditorNav />
        <DirectionAwareContent />
      </div>
    </DirectionAwareTabsProvider>
  );
};
