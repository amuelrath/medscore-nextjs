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

export const FormLayout: FC<FormLayoutProps> = ({ editor, responses }) => {
  const tabs = [
    { id: 0, label: "Editor", content: editor },
    { id: 1, label: "Responses", content: responses },
  ];

  return (
    <DirectionAwareTabsProvider tabs={tabs}>
      <div className="flex flex-col w-full" >
      <FormEditorNav />
        <div className="px-4 pb-4" >
        <DirectionAwareContent />
        </div>
      </div>
    </DirectionAwareTabsProvider>
  );
};
