import { useAtom, useAtomValue } from "jotai/index";
import { selectedAssessmentIdAtom, selectedResponseIdAtom } from "@/store/form-atoms";
import React, { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, EyeOffIcon, InfoIcon, TrashIcon } from "lucide-react";
import EasyTooltip from "@/components/ui/easy-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useFormContext } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResponse } from "@/server/actions/responses/delete-response";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";
import { AssessmentResponsesResult } from "@/server/actions/responses/get-assessment-responses-with-users";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ResponseDropdown({ children }: { children: ReactNode }) {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger disabled={!selectedResponseId}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="mr-8">
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
          open={deleteDialogOpen}
          onOpenChange={(o) => setDeleteDialogOpen(o)}
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
          <DeleteDialogContent
            closeDeleteDialog={() => setDeleteDialogOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteDialogContent({
                               closeDeleteDialog,
                             }: {
  closeDeleteDialog: () => void;
}) {
  const { getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);
  const selectedAssessmentId = useAtomValue(selectedAssessmentIdAtom);
  const [selectedResponseId, setSelectedResponseId] = useAtom(
    selectedResponseIdAtom,
  );

  const queryClient = useQueryClient();
  const { mutate: mutateDeleteResponse } = useMutation({
    mutationFn: deleteResponse,
    onMutate: () => {
      // todo consolidate data structure
      queryClient.setQueryData(
        ["assessments", formId],
        (oldData: AssessmentsResult): AssessmentsResult => {
          return oldData.filter((a) => a.id !== selectedResponseId);
        },
      );

      queryClient.setQueryData(
        ["responses", selectedAssessmentId],
        (oldData: AssessmentResponsesResult): AssessmentResponsesResult => {
          return oldData.filter((r) => r.id !== selectedResponseId);
        },
      );
      // deselect the response
      setSelectedResponseId(undefined);
    },
    onError: () => {
      // todo error messages constant
      queryClient
        .invalidateQueries({ queryKey: ["assessments", formId] })
        .then(() => {
          return toast.error("Something went wrong.");
        });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Response</DialogTitle>
        <DialogDescription>
          This action is irreversible and data from this response will be
          permanently lost.
        </DialogDescription>
      </DialogHeader>
      {selectedResponseId && (
        <div className="flex w-full flex-row items-center justify-end space-x-2">
          <Button
            onClick={() => {
              closeDeleteDialog();
              mutateDeleteResponse(selectedResponseId);
            }}
            variant="destructive"
          >
            Delete
          </Button>
          <Button onClick={closeDeleteDialog} variant="secondary">
            Cancel
          </Button>
        </div>
      )}
    </DialogContent>
  );
}

const TooltipContent = () => {
  return (
    <div className="mr-4 flex flex-col">
      <h6 className="font-semibold underline">Omit Response</h6>
      <p className="font-light">
        Hide this response from future reports. You will still be able to access
        it on this page.
      </p>
    </div>
  );
};
