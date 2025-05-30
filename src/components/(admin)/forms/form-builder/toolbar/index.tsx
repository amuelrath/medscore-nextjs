'use client';

import { useAutosave } from '@/components/(admin)/forms/form-builder/hooks/use-autosave';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { ManageAccessModal } from '@/components/(admin)/forms/form-builder/toolbar/modals/manage-access-modal';
import { PassingCriteriaModal } from '@/components/(admin)/forms/form-builder/toolbar/modals/passing-criteria-modal';
import { RoleWeightModal } from '@/components/(admin)/forms/form-builder/toolbar/modals/role-weight-modal';
import { TFormBuilderSchema } from '@/components/(admin)/forms/form-builder/types';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Switch } from '@/components/ui/switch';
import { saveForm } from '@/server/actions/forms/save-form';
import { MenubarArrow } from '@radix-ui/react-menubar';
import { ExternalLinkIcon, Loader, LockOpenIcon, SaveIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

function FormBuilderMenubar() {
  const settings = useFormBuilderStore((state) => state.settings);
  const setSettings = useFormBuilderStore((state) => state.setSettings);

  const handleAllowMultipleResponsesClick = () => {
    setSettings({
      ...settings,
      allowMultipleResponses: !settings.allowMultipleResponses,
    });
  };

  const handleAllowSaveAndQuitClick = () => {
    setSettings({ ...settings, allowSaveAndQuit: !settings.allowSaveAndQuit });
  };

  const handleAllowResponseRevisionsClick = () => {
    setSettings({
      ...settings,
      allowResponseRevisions: !settings.allowResponseRevisions,
    });
  };

  const handleEnableScoringClick = () => {
    setSettings({ ...settings, enableScoring: !settings.enableScoring });
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Permissions</MenubarTrigger>
        <MenubarContent>
          <ManageAccessModal>
            <MenubarItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              Manage Edit Access
              <MenubarShortcut>
                <ExternalLinkIcon size={12} />
              </MenubarShortcut>
            </MenubarItem>
          </ManageAccessModal>
          <MenubarArrow />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Responses</MenubarTrigger>
        <MenubarContent>
          <MenubarArrow />
          <MenubarItem>
            Allow Revisions
            <MenubarShortcut onClick={(e) => e.stopPropagation()}>
              <Switch
                size="xs"
                checked={settings.allowResponseRevisions}
                onClick={handleAllowResponseRevisionsClick}
              />
            </MenubarShortcut>
          </MenubarItem>

          <MenubarItem>
            Allow Save & Quit
            <MenubarShortcut onClick={(e) => e.stopPropagation()}>
              <Switch
                size="xs"
                checked={settings.allowSaveAndQuit}
                onClick={handleAllowSaveAndQuitClick}
              />
            </MenubarShortcut>
          </MenubarItem>

          <MenubarItem>
            Allow Multiple Submissions
            <MenubarShortcut
              className="ml-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch
                size="xs"
                checked={settings.allowMultipleResponses}
                onClick={handleAllowMultipleResponsesClick}
              />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Manage Time Limits
            <MenubarShortcut>
              <ExternalLinkIcon size={12} />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Scoring</MenubarTrigger>
        <MenubarContent>
          <MenubarArrow />
          <MenubarItem>
            Enable Scoring
            <MenubarShortcut onClick={(e) => e.stopPropagation()}>
              <Switch
                size="xs"
                checked={settings.enableScoring}
                onClick={handleEnableScoringClick}
              />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <PassingCriteriaModal>
            <MenubarItem
              onSelect={(e) => e.preventDefault()}
              disabled={!settings.enableScoring}
            >
              Manage Passing Criteria
              <MenubarShortcut>
                <ExternalLinkIcon size={12} />
              </MenubarShortcut>
            </MenubarItem>
          </PassingCriteriaModal>
          <RoleWeightModal>
            <MenubarItem
              onSelect={(e) => e.preventDefault()}
              disabled={!settings.enableScoring}
            >
              Manage Role Weights
              <MenubarShortcut>
                <ExternalLinkIcon size={12} />
              </MenubarShortcut>
            </MenubarItem>
          </RoleWeightModal>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}

const MemoFormBuilderMenubar = React.memo(FormBuilderMenubar);

export function FormBuilderToolbar() {
  const params = useParams();
  const formId = params.formId.toString();

  const storeId = useFormBuilderStore((state) => state.id);
  const title = useFormBuilderStore((state) => state.title);
  const setTitle = useFormBuilderStore((state) => state.setTitle);

  const settings = useFormBuilderStore((state) => state.settings);
  const formItems = useFormBuilderStore((state) => state.items);

  const data: TFormBuilderSchema = { id: formId, title, settings, formItems };

  const { isSaving } = useAutosave({
    data,
    saveFn: (newObj, oldObj) => saveForm({ newObj, oldObj }),
    disabled: storeId !== formId,
  });

  return (
    <div className="w-full flex space-y-0.5 justify-start flex-col p-2 border-b bg-white">
      <div className="flex flex-row items-center space-x-2">
        <Input
          className="flex w-fit border z-30 max-h-7 font-medium bg-transparent text-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outline"
          size="sm"
        />
        {isSaving ? (
          <Loader className="opacity-50 cursor-pointer" size={16} />
        ) : (
          <SaveIcon className="opacity-50 cursor-pointer" size={16} />
        )}
        <LockOpenIcon className="opacity-50" size={16} />
      </div>
      <div className="bg-primary/5 w-full rounded">
        <MemoFormBuilderMenubar />
      </div>
    </div>
  );
}
