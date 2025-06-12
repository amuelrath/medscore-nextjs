import { Button } from '@/components/ui/button';
import { UserFoldersResult } from '@/features/forms-home/actions/folders/get-user-folders';
import { Folder } from '@/features/forms-home/components/folders/folder';
import { CreateFolderDialogTrigger } from '@/features/forms-home/components/modals/create-folder-dialog';
import { PlusIcon } from 'lucide-react';

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
        <Button
          variant="secondary"
          className="space-x-2 flex-shrink-0"
          size="xs"
        >
          <PlusIcon size={12} />
        </Button>
      </CreateFolderDialogTrigger>
      {folders?.map((f) => (
        <div key={f.id} className="flex-shrink-0">
          <Folder handleSelectFolder={handleSelectFolder} folder={f} />
        </div>
      ))}
    </div>
  );
}
