import { useFoldersMutations } from '@/components/(admin)/forms/home/hooks/use-folders-mutations';
import { DeleteFormDialogTrigger } from '@/components/(admin)/forms/home/modals/delete-evaluation-dialog';
import { RenameFormDialogTrigger } from '@/components/(admin)/forms/home/modals/rename-form-dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { truncate } from '@/lib/helpers/truncate';
import { getUserFolders } from '@/server/actions/forms/get-user-folders';
import { useQuery } from '@tanstack/react-query';
import {
  ExternalLinkIcon,
  FolderPlusIcon,
  FolderUpIcon,
  TextCursorIcon,
  TrashIcon,
} from 'lucide-react';
import { ReactNode, useCallback } from 'react';

function FormCardContextMenuFolderList({ formId }: { formId: string }) {
  // Get folders data
  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: () =>
      getUserFolders({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const { mutateAddFormToFolder } = useFoldersMutations();

  const isInFolder = folders?.some((folder) =>
    folder.forms.some((f) => f.id === formId),
  );

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Move to folder</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {foldersLoading
          ? ''
          : folders?.map((f) => (
              <ContextMenuItem
                key={f.id}
                onSelect={() =>
                  mutateAddFormToFolder({ formId, folderId: f.id })
                }
                className="font-medium"
              >
                {truncate(f.title, 25)}
                <ContextMenuShortcut>
                  <FolderPlusIcon size={12} />
                </ContextMenuShortcut>
              </ContextMenuItem>
            ))}
        {isInFolder && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => mutateAddFormToFolder({ formId, folderId: null })}
            >
              Remove from folder
              <ContextMenuShortcut>
                <FolderUpIcon size={12} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

export function FormCardContextMenu({
  formId,
  title,
  children,
  asChild = false,
}: {
  formId: string;
  title: string;
  children: ReactNode;
  asChild?: boolean;
}) {
  // Handler for opening in new tab
  const handleOpenInNewTab = useCallback(() => {
    window.open(`/forms/${formId}`, '_blank');
  }, [formId]);

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild={asChild}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <DeleteFormDialogTrigger title={title} id={formId}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Remove
            <ContextMenuShortcut>
              <TrashIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </DeleteFormDialogTrigger>
        <RenameFormDialogTrigger formId={formId} currentTitle={title}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            Rename
            <ContextMenuShortcut>
              <TextCursorIcon size={12} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </RenameFormDialogTrigger>
        <ContextMenuItem onSelect={handleOpenInNewTab}>
          Open in new tab
          <ContextMenuShortcut>
            <ExternalLinkIcon size={12} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <FormCardContextMenuFolderList formId={formId} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
