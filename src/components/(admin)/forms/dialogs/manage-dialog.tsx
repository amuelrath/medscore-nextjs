"use client";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { LottieHover } from "@/components/ui/lottie-hover";
import ASSESSMENT from "public/icons/assessment-white.json";
import { ScheduledAssessmentsSelect } from "@/components/(admin)/forms/dialogs/scheduled-assessments-select";
import { EditAssessmentForm } from "@/components/(admin)/forms/dialogs/edit-assessment-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  manageDialogOpenAtom,
  manageDialogSelectedAssessmentIdAtom,
} from "@/store/form-atoms";
import { useAtom, useSetAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { administerForm } from "@/server/actions/form-codes/administer-form";
import { useFormContext } from "react-hook-form";
import { addBusinessDays, addHours } from "date-fns";
import { toast } from "sonner";
import { FormResult } from "@/server/actions/forms/get-form-by-id";

export function ManageDialog() {
  const { getValues } = useFormContext();
  const formId = getValues(`id`);
  const [hovering, setHovering] = useState<boolean>(false);
  const [open, setOpen] = useAtom(manageDialogOpenAtom);
  const setActiveCodeId = useSetAtom(manageDialogSelectedAssessmentIdAtom);

  const handleClose = () => {
    if (open) {
      setOpen(false);
      setActiveCodeId(undefined);
    }
  };

  const queryClient = useQueryClient();
  const { mutate: createAssessment } = useMutation({
    mutationFn: administerForm,
    onSuccess: (result) => {
      if (!result) return toast.error("Something went wrong. Try again.");

      queryClient.setQueryData(
        ["form", formId],
        (oldData: FormResult | undefined) => {
          if (!oldData) return oldData;

          // Add the new form code to the existing array
          const updatedAssessments: FormResult["assessments"] = [
            ...oldData.assessments,
            {
              ...result,
            },
          ];

          setActiveCodeId(result.id);

          return {
            ...oldData,
            assessments: updatedAssessments,
          };
        },
      );

      // Invalidate the forms lite query to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["forms", "lite"] });
    },
  });

  const handleCreateNewAssessment = () => {
    // deal with dates
    const now = new Date();
    const startsAt = addBusinessDays(now, 1);
    const expiresAt = addHours(startsAt, 2);

    // just create a 'blank' form code
    createAssessment({
      title: "Untitled Assessment",
      startsAt,
      expiresAt,
      isDirectObservation: false,
      formId,
      userIds: [],
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (val ? setOpen(true) : handleClose())}
    >
      <Button
        size="xs"
        onClick={() => setOpen(true)}
      >
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="flex flex-row items-center space-x-2"
        >
          <LottieHover
            loop={false}
            isHovering={hovering}
            size="xs"
            src={ASSESSMENT}
          />
          <span className="font-semibold">Manage Assessments</span>
        </div>
      </Button>
      <DialogContent
        onCloseClick={handleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="flex h-[500px] min-w-[900px] flex-col"
      >
        <div className="grid h-full grid-cols-3 gap-4">
          <div className="col-span-1 flex h-full flex-col space-y-4">
            <DialogHeader className="w-full">
              <DialogTitle className="w-full">Manage Assessments</DialogTitle>
              <DialogDescription>
                Start or schedule an assessment.
              </DialogDescription>
            </DialogHeader>
            <Button size="xs" onClick={handleCreateNewAssessment}>
              New Assessment
            </Button>
            <ScheduledAssessmentsSelect />
          </div>
          <div className="col-span-2 h-full pb-6">
            <Suspense fallback={<FormSkeleton />}>
              <EditAssessmentForm />
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </>
  );
}
