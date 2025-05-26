'use client';

import {
  AssessmentCreatorDialog,
  TAssessmentEditorFormSchema,
} from '@/components/(admin)/forms/home/assessment-manager/assessment-creator-dialog';
import { AssessmentRequestContent } from '@/components/(admin)/forms/home/assessment-request-content';
import { FoldersList } from '@/components/(admin)/forms/home/folders/folders-list';
import { FormCardDragOverlay } from '@/components/(admin)/forms/home/form-cards/form-card';
import { FormsList } from '@/components/(admin)/forms/home/form-cards/forms-list';
import { FormsListSearchbar } from '@/components/(admin)/forms/home/form-cards/forms-list-searchbar';
import { CreateFormDialog } from '@/components/(admin)/forms/home/modals/create-form-dialog';
import { cn } from '@/lib/helpers/utils';
import { createAssessmentWithRequests } from '@/server/actions/assessments/create-assessment-with-requests';
import {
  FormsLiteResult,
  getAllFormsLite,
} from '@/server/actions/forms/get-all-forms-lite';
import { getUserFolders } from '@/server/actions/forms/get-user-folders';
import { moveFormToFolder } from '@/server/actions/forms/move-form-to-folder';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addHours } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

// how far we have to drag before the overlay kicks in
const ACTIVATION_DISTANCE = 60;

// Droppable breadcrumb component for removing item from folder
function DroppableFormsBreadcrumb({
  selectedFolderId,
  handleBreadcrumbClick,
}: {
  selectedFolderId: string | null;
  handleBreadcrumbClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'forms-breadcrumb',
    data: {
      title: 'All Forms',
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={handleBreadcrumbClick}
      className={cn(
        'text-2xl border border-transparent font-semibold transition-all duration-200 py-1 rounded',
        selectedFolderId
          ? 'text-muted-foreground hover:text-foreground cursor-pointer'
          : 'text-foreground cursor-default',
        isOver && 'bg-primary/10 px-2 border border-primary/20 text-primary',
      )}
    >
      Forms
    </button>
  );
}

function useFormCardDrag() {
  const queryClient = useQueryClient();

  const { mutate: mutationAddFormToFolder } = useMutation({
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeId = event.active.id.toString();
      const overId = event.over?.id.toString();

      // Early return if no valid drop target
      if (!overId) return;

      // Handle form dropped on folder
      if (activeId.startsWith('form-') && overId.startsWith('folder-')) {
        const formId = activeId.replace('form-', '');
        const folderId = overId.replace('folder-', '');

        // Only proceed if we have valid IDs after extraction
        if (formId && folderId) {
          mutationAddFormToFolder({
            formId,
            folderId,
          });
        }
      }

      // Handle form dropped on "Forms" breadcrumb (remove from folder)
      if (activeId.startsWith('form-') && overId === 'forms-breadcrumb') {
        const formId = activeId.replace('form-', '');

        if (formId) {
          mutationAddFormToFolder({
            formId,
            folderId: null, // Remove from folder by setting to null
          });
        }
      }
    },
    [mutationAddFormToFolder],
  );

  // Configure sensors with minimum distance
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: ACTIVATION_DISTANCE, // Minimum pixels to move before drag starts
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: ACTIVATION_DISTANCE,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return {
    handleDragEnd,
    sensors,
  };
}

export function FormsHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get selectedFolderId from URL params
  const selectedFolderId = searchParams.get('folder');

  // get form and program user data // todo fixme assessment dialog and menu might rely on this query's data
  const { data: forms, isLoading: formsLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  // Get folders data
  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: () =>
      getUserFolders({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const isLoading = formsLoading || foldersLoading;

  // initialize DnD for folder management
  const { sensors, handleDragEnd } = useFormCardDrag();

  const queryClient = useQueryClient();

  // mutation for creating an assessment
  const { mutate: createAssessmentMutation } = useMutation({
    mutationFn: createAssessmentWithRequests,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const submitFn = (data: TAssessmentEditorFormSchema) => {
    createAssessmentMutation({
      ...data,
    });
  };

  // get the selected folder object for display
  const selectedFolder = useMemo(
    () =>
      selectedFolderId ? folders?.find((f) => f.id === selectedFolderId) : null,
    [selectedFolderId, folders],
  );

  const filteredForms = useMemo(() => {
    if (selectedFolderId) {
      return forms
        ?.filter((f) => f.folderId === selectedFolderId)
        .sort(
          (a, b) =>
            new Date(b.lastOpenedAt).getTime() -
            new Date(a.lastOpenedAt).getTime(),
        );
    }

    // apply the search to all forms even if they're in a folder
    if (searchTerm) {
      const orderedForms = forms?.sort(
        (a, b) =>
          new Date(b.lastOpenedAt).getTime() -
          new Date(a.lastOpenedAt).getTime(),
      );

      return orderedForms?.filter((form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // get forms that arent in a folder
    const unfolderForms = forms?.filter((form) => !form.folderId);

    // there is no search term: return only the forms not in a folder
    return unfolderForms?.sort(
      (a, b) =>
        new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime(),
    );
  }, [forms, searchTerm, selectedFolderId]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
    // Clear folder selection when searching to show all matching forms
    if (term && selectedFolderId) {
      router.push(window.location.pathname);
    }
  };

  const handleSelectFolder = useCallback(
    (folderId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (folderId) {
        params.set('folder', folderId);
      } else {
        params.delete('folder');
      }

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      router.push(newUrl);

      // Clear search when selecting a folder
      if (folderId && searchTerm) {
        setSearchTerm('');
      }
    },
    [router, searchParams, searchTerm],
  );

  const handleBreadcrumbClick = () => {
    if (selectedFolderId) {
      // If we're in a folder, go back to "All Forms" view
      router.push(window.location.pathname);
    }
  };

  return (
    <main className="flex flex-grow flex-col">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[snapCenterToCursor]}
      >
        <div className="h-12 flex-shrink-0 items-center grid grid-cols-3 px-4 border-border bg-card">
          <div className="flex items-center select-none space-x-2">
            {selectedFolder ? (
              <>
                <DroppableFormsBreadcrumb
                  selectedFolderId={selectedFolderId}
                  handleBreadcrumbClick={handleBreadcrumbClick}
                />
                <span className="text-muted-foreground text-xl">/</span>
                <span className="text-2xl font-semibold text-foreground">
                  {selectedFolder.title}
                </span>
              </>
            ) : (
              <span className="text-2xl border border-transparent font-semibold text-foreground">
                Forms
              </span>
            )}
          </div>

          <FormsListSearchbar handleFilter={handleFilter} />

          <div className="flex flex-row justify-self-end items-center space-x-4">
            <CreateFormDialog />
            {!isLoading && forms && (
              <AssessmentCreatorDialog
                forms={forms}
                defaultValues={{
                  startsAt: new Date().toISOString(),
                  expiresAt: addHours(new Date(), 4).toISOString(),
                }}
                submitFn={submitFn}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 gap-y-0 flex-grow px-4 pb-4 pt-2">
          <div className="flex flex-col pt-1 col-span-4 gap-4">
            <FoldersList
              handleSelectFolder={handleSelectFolder}
              folders={folders}
            />
            <hr />
            <div className="scrollbar scrollbar-track-transparent pb-4 scrollbar-thumb-neutral-300 overflow-y-scroll min-h-[76vh] max-h-[76vh]">
              <FormsList
                key={selectedFolderId} // todo prevent reordering animation on folder switch
                filteredForms={filteredForms}
              />
            </div>
            <FormCardDragOverlay />
          </div>
          <div className="col-span-2 h-full">
            <AssessmentRequestContent />
          </div>
        </div>
      </DndContext>
    </main>
  );
}
