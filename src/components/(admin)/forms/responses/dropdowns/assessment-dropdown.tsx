"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {  DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as React from "react";
import {
  DownloadIcon,
  EditIcon,
  EyeOffIcon,
  InfoIcon,
  TrashIcon,
} from "lucide-react";
import EasyTooltip from "@/components/ui/easy-tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import Loading from "@/components/ui/loading";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { renameAssessment } from "@/server/actions/responses/rename-assessment";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";
import { toast } from "sonner";
import { selectedAssessmentIdAtom } from "@/store/form-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { deleteAssessment } from "@/server/actions/responses/delete-assessment";

export function AssessmentDropdown() {
  const selectedAssessmentId = useAtomValue(selectedAssessmentIdAtom);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // ensure only one dialog can be open at a time.
  useEffect(() => {
    if (editDialogOpen) {
      setDeleteDialogOpen(false);
    }
    if (deleteDialogOpen) {
      setEditDialogOpen(false);
    }
  }, [editDialogOpen, deleteDialogOpen]);

  return (
    <DropdownMenu onOpenChange={(o) => setPopoverOpen(o)} open={popoverOpen} modal={false}>
      <DropdownMenuTrigger disabled={!selectedAssessmentId} asChild>
        <button className="group flex h-7  w-8 flex-row items-center justify-center rounded-md border border-neutral-300 bg-primary/5 px-2 font-medium  text-neutral-600 transition-colors hover:border-neutral-600 disabled:pointer-events-none disabled:opacity-30">
          <DotsHorizontalIcon className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog
          onOpenChange={(open) => setEditDialogOpen(open)}
          open={editDialogOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="space-x-2"
            >
              <EditIcon size={14} className="opacity-50" />
              <p>Rename</p>
            </DropdownMenuItem>
          </DialogTrigger>
          {selectedAssessmentId && (
            <RenameDialogContent
              closeEditDialog={() => setEditDialogOpen(false)}
              closePopover={() => setPopoverOpen(false)}
              assessmentId={selectedAssessmentId}
            />
          )}
        </Dialog>

        <DropdownMenuItem className="justify-between">
          <div className="flex flex-row items-center space-x-2">
            <EyeOffIcon size={14} className="opacity-50" />
            <p>Hide</p>
          </div>
          <EasyTooltip position="left" tooltipContent={<TooltipContent />}>
            <InfoIcon
              size={8}
              className="opacity-50 transition-opacity hover:opacity-100"
            />
          </EasyTooltip>
        </DropdownMenuItem>

        <DropdownMenuItem className="space-x-2">
          <DownloadIcon size={14} className="opacity-50" />
          <p>Export CSV</p>
        </DropdownMenuItem>
        <Dialog
          onOpenChange={(open) => setDeleteDialogOpen(open)}
          open={deleteDialogOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="space-x-2"
            >
              <TrashIcon size={14} className="opacity-50" />
              <p>Delete</p>
            </DropdownMenuItem>
          </DialogTrigger>
          {selectedAssessmentId && (
            <DeleteDialogContent
              assessmentId={selectedAssessmentId}
              closeDeleteDialog={() => setDeleteDialogOpen(false)}
              closePopover={() => setPopoverOpen(false)}
            />
          )}
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const TooltipContent = () => {
  return (
    <div className="mr-4 flex flex-col">
      <h6 className="font-semibold underline">Omit Assessment</h6>
      <p className="font-light">
        Hide this assessment from future reports. You will still be able to
        access it on this page.
      </p>
    </div>
  );
};

const ZRenameSchema = z.object({
  title: z.string(),
});
type TRenameSchema = z.infer<typeof ZRenameSchema>;

function RenameDialogContent({
  assessmentId,
  closeEditDialog,
  closePopover,
}: {
  assessmentId: string;
  closeEditDialog: () => void;
  closePopover: () => void;
}) {
  const { assessments, formId, isLoading } = useGetFormAssessments();
  const assessment = assessments?.find((a) => a.id === assessmentId);

  const { register, handleSubmit } = useForm<TRenameSchema>({
    resolver: zodResolver(ZRenameSchema),
  });


  const queryClient = useQueryClient();
  const { mutate: renameAssessmentMutation } = useMutation({
    mutationFn: renameAssessment,
    onMutate: (data) => {
      // optimistically update the query cache with the new name
      // todo there are more than one places where assessment data is fetched.
      // todo SINGLE SOURCE OF TRUTH

      queryClient.setQueryData(
        ["assessments", formId],
        (oldData: AssessmentsResult) => {
          const assessmentToUpdate = oldData.find(
            (a) => a.id === data.assessmentId,
          );
          if (!assessmentToUpdate)
            return toast.error("Couldn't locate that assessment.");

          const updatedAssessment = {
            ...assessmentToUpdate,
            title: data.title,
          };

          return [
            updatedAssessment,
            ...oldData.filter((a) => a.id !== data.assessmentId),
          ];
        },
      );
    },
    onSuccess: () => {
      toast.success("Changes saved.");
    },
    onError: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["assessments", formId],
      });
    },
  });

  if (!assessment || !assessmentId) return <></>;

  const submitForm = (data: TRenameSchema) => {
    renameAssessmentMutation({ assessmentId, title: data.title });
  };

  return (
    <DialogContent className="flex h-32 max-w-[400px] flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DialogHeader className="w-full">
            <DialogTitle className="w-full">Rename Assessment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex flex-row items-center space-x-2">
              <Input
                {...register(`title`)}
                defaultValue={assessment.title}
                size="sm"
              />
              <Button onClick={() => {
                closeEditDialog();
                closePopover()
              }} size="sm">
                Save
              </Button>
            </div>
          </form>
        </>
      )}
    </DialogContent>
  );
}

function DeleteDialogContent({
  assessmentId,
  closeDeleteDialog,
  closePopover
}: {
  assessmentId: string;
  closeDeleteDialog: () => void;
  closePopover: () => void;
}) {
  const setSelectedAssessmentId = useSetAtom(selectedAssessmentIdAtom)

  const { assessments, formId, isLoading } = useGetFormAssessments();
  const assessment = assessments?.find((a) => a.id === assessmentId);

  const queryClient = useQueryClient();
  const { mutate: mutateDeleteAssessment } = useMutation({
    mutationFn: deleteAssessment,
    onMutate: () => {
      queryClient.setQueryData(["assessments", formId], (oldData: AssessmentsResult): AssessmentsResult => {
        return oldData.filter(a => a.id !== assessmentId)
      })

      setSelectedAssessmentId(undefined)

    },
    onError: () => {
      toast.error("Something went wrong.")
    },
  });


  if (!assessment) return <></>;

  return (
    <DialogContent className="flex flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DialogHeader className="w-full">
            <DialogTitle className="w-full">{`Delete "${assessment.title}"`}</DialogTitle>
            <DialogDescription>
              This action is irreversible and all response data will be
              permanently lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full flex-row items-center justify-end space-x-2">
            <Button
              onClick={() => {
                closeDeleteDialog();
                closePopover()
                mutateDeleteAssessment(assessmentId);
              }}
              variant="destructive"
            >
              Delete
            </Button>
            <Button onClick={closeDeleteDialog} variant="secondary">
              Cancel
            </Button>
          </div>
        </>
      )}
    </DialogContent>
  );
}
