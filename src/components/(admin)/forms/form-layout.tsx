'use client';

import { FormEditorNav } from '@/components/(admin)/forms/editor/form-editor-nav';
import {
  DirectionAwareContent,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-tabs';
import {
  selectedAssessmentIdAtom,
  selectedResponseIdAtom,
} from '@/store/form-atoms';
import { useSetAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';

interface FormLayoutProps {
  editor: ReactNode;
  responses: ReactNode;
  formId: string;
}

// separates the tabs and tabs content
export function FormLayout({ editor, responses, formId }: FormLayoutProps) {
  const setSelectedResponseId = useSetAtom(selectedResponseIdAtom);
  const setSelectedFormCodeId = useSetAtom(selectedAssessmentIdAtom);

  // clear jotai state
  useEffect(() => {
    setSelectedFormCodeId(undefined);
    setSelectedResponseId(undefined);
  }, [formId, setSelectedFormCodeId, setSelectedResponseId]);

  const tabs = [
    { id: 0, label: 'Editor', content: editor },
    { id: 1, label: 'Responses', content: responses },
  ];

  return (
    <DirectionAwareTabsProvider tabs={tabs}>
      <div className="flex w-full flex-col">
        <FormEditorNav />
        <DirectionAwareContent />
      </div>
    </DirectionAwareTabsProvider>
  );
}
