import { FormsLiteResult } from '@/server/actions/forms/get-all-forms-lite';
import { moveFormToFolder } from '@/server/actions/forms/move-form-to-folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useFoldersMutations() {
  const queryClient = useQueryClient();

  const { mutate: mutateAddFormToFolder } = useMutation({
    mutationFn: moveFormToFolder,
    onMutate: (vars) => {
      // optimistically update the folderId to the form
      queryClient.setQueryData(['forms'], (oldData: FormsLiteResult) =>
        oldData?.map((f) =>
          f.id === vars.formId ? { ...f, folderId: vars.folderId } : f,
        ),
      );
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
    onSuccess: async (data, vars, ctx) => {
      // todo optimistically update folders query
      await queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success(
        data.folderTitle
          ? `Moved "${data.title}" to ${data.folderTitle}`
          : `Removed "${data.title}" from folder`,
      );
    },
  });

  return { mutateAddFormToFolder };
}
