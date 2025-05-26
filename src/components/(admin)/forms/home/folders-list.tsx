import { CreateFolderDialogTrigger } from '@/components/(admin)/forms/home/modals/create-folder-dialog';
import { DeleteFolderDialogTrigger } from '@/components/(admin)/forms/home/modals/delete-folder-dialog';
import { RenameFolderDialogTrigger } from '@/components/(admin)/forms/home/modals/rename-folder-dialog';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { truncate } from '@/lib/helpers/truncate';
import { cn } from '@/lib/helpers/utils';
import { UserFoldersResult } from '@/server/actions/forms/get-user-folders';
import { useDroppable } from '@dnd-kit/core';
import { FolderIcon, PlusIcon, TextCursorIcon, TrashIcon } from 'lucide-react';
import { ReactNode } from 'react';

type FolderProps = {
  folder: UserFoldersResult[number];
  handleSelectFolder: (folderId: string | null) => void;
};

function Folder({ folder, handleSelectFolder }: FolderProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      title: folder.title,
    },
  });

  return (
    <FolderContextMenu title={folder.title} id={folder.id}>
      <button
        type="button"
        ref={setNodeRef}
        onClick={() => handleSelectFolder(folder.id)}
        className={cn(
          'col-span-1 h-10 flex transition flex-row items-center space-x-2 font-medium px-4 border border-border rounded-lg bg-card hover:border-accent-secondary pt-0.5',
          isOver && 'bg-primary/5 border-accent-secondary text-primary',
        )}
      >
        <FolderIcon className="size-4" />
        <p className="text-sm select-none">{truncate(folder.title, 17)}</p>
      </button>
    </FolderContextMenu>
  );
}

function FolderContextMenu({
  children,
  title,
  id,
}: {
  children: ReactNode;
  title: string;
  id: string;
}) {
  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <DeleteFolderDialogTrigger title={title} folderId={id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Remove
            <ContextMenuShortcut>
              <TrashIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </DeleteFolderDialogTrigger>
        <RenameFolderDialogTrigger folderId={id} currentTitle={title}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Rename
            <ContextMenuShortcut>
              <TextCursorIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </RenameFolderDialogTrigger>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FoldersList({
                              folders,
                              handleSelectFolder,
                            }: {
  folders: UserFoldersResult | undefined;
  handleSelectFolder: (folderId: string | null) => void;
}) {
  return (
    <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
      <CreateFolderDialogTrigger>
        <Button variant="secondary" className="space-x-2 flex-shrink-0" size="xs">
          <PlusIcon size={12} />
        </Button>
      </CreateFolderDialogTrigger>
      {folders?.map((f) => (
        <div key={f.id} className="flex-shrink-0">
          <Folder
            handleSelectFolder={handleSelectFolder}
            folder={f}
          />
        </div>
      ))}
    </div>
  );
}
