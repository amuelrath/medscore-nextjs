import { DeleteFolderDialogTrigger } from '@/components/(admin)/forms/home/modals/delete-folder-dialog';
import { RenameFolderDialogTrigger } from '@/components/(admin)/forms/home/modals/rename-folder-dialog';
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
import { FolderIcon, TextCursorIcon, TrashIcon } from 'lucide-react';
import { ReactNode } from 'react';

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

type FolderProps = {
  folder: UserFoldersResult[number];
  handleSelectFolder: (folderId: string | null) => void;
};

export function Folder({ folder, handleSelectFolder }: FolderProps) {
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
