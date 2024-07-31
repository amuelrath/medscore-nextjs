"use client";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { formatDate, isAfter, isBefore, parseISO } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssessmentDetails } from "@/server/actions/form-codes/update-assessment-details";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiple-selector";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { getFullName } from "@/lib/helpers/getFullName";
import { Button } from "@/components/ui/button";
import LOADING from "public/icons/three-dots-navy.json";
import PLAY from "public/icons/play-hover.json";
import { cn } from "@/lib/helpers/utils";
import Lottie from "lottie-react";
import { LottieHover } from "@/components/ui/lottie-hover";
import { cancelAdministerForm } from "@/server/actions/form-codes/cancel-administer-form";
import { useFormResultInEditorQuery } from "@/hooks/queries/use-form-result-in-editor-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  manageDialogSelectedAssessmentIdAtom,
  selectedAssessmentIdAtom,
  selectedResponseIdAtom,
} from "@/store/form-atoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import TwoStageConfirmButton from "@/components/ui/confirm-button";
import { ScientistIllustration } from "@/components/illustrations/scientist-illustration";
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration";
import COPY from "public/icons/system-regular-99-copy.json";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";

export function EditAssessmentForm() {
  const [activeCodeId, setActiveCodeId] = useAtom(
    manageDialogSelectedAssessmentIdAtom,
  );
  const [selectedAssessmentId, setSelectedAssessmentId] = useAtom(
    selectedAssessmentIdAtom,
  );
  const [selectedResponseId, setSelectedResponseId] = useAtom(
    selectedResponseIdAtom,
  );
  const {
    formResult,
    error,
    isLoading: isFormLoading,
  } = useFormResultInEditorQuery();
  const {
    assessments,
    formId,
    isLoading: isAssessmentsLoading,
  } = useGetFormAssessments();

  const selectedAssessment = assessments?.find((fc) => fc.id === activeCodeId);

  useEffect(() => {
    if (assessments && assessments.length > 0 && !activeCodeId) {
      setActiveCodeId(assessments[0].id);
    }
  }, [assessments, activeCodeId, setActiveCodeId]);

  const studentOptions = formResult?.programs.users
    .filter((u) => u.user.role === "STUDENT")
    .map((s) => ({
      value: s.user.id,
      label: getFullName(s.user),
    }));

  const evaluateeIds = selectedAssessment?.evaluatees
    .map((uwc) => uwc.user)
    ?.map((u) => u.id)
    .filter((id) => id !== undefined);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<TEditAssessmentFormSchema>({
    resolver: zodResolver(ZEditAssessmentFormSchema),
    defaultValues: {
      assessmentId: selectedAssessment?.id || "",
      title: selectedAssessment?.title || "",
      evaluateeIds,
      expiresAt: selectedAssessment?.expiresAt
        ? formatDate(selectedAssessment.expiresAt, "yyyy-MM-dd'T'HH:mm")
        : "",
      startsAt: selectedAssessment?.startsAt
        ? formatDate(selectedAssessment.startsAt, "yyyy-MM-dd'T'HH:mm")
        : "",
    },
  });

  useEffect(() => {
    if (selectedAssessment) {
      reset({
        assessmentId: selectedAssessment.id || "",
        title: selectedAssessment.title || "",
        evaluateeIds: selectedAssessment.evaluatees
          .map((uwc) => uwc.user?.id)
          .filter((id) => id !== undefined),
        expiresAt: selectedAssessment.expiresAt
          ? formatDate(selectedAssessment.expiresAt, "yyyy-MM-dd'T'HH:mm")
          : "",
        startsAt: selectedAssessment.startsAt
          ? formatDate(selectedAssessment.startsAt, "yyyy-MM-dd'T'HH:mm")
          : "",
      });
    }
  }, [selectedAssessment, reset]);

  const queryClient = useQueryClient();
  const { mutate: updateDetails, isPending } = useMutation({
    mutationFn: updateAssessmentDetails,
    onSuccess: (result) => {
      if (result.status === "error")
        return toast.error("Something went wrong. Try again.");
      queryClient.setQueryData(
        ["assessments", formId],
        (oldData: AssessmentsResult | undefined) => {
          if (!oldData) return oldData;

          const updatedAssessments: AssessmentsResult = oldData.map((a) =>
            a.id === result.data.id
              ? {
                ...a,
                title: result.data.title,
                startsAt: new Date(result.data.startsAt),
                expiresAt: new Date(result.data.expiresAt),
                evaluatees: result.data.evaluateeIds.map((id) => ({
                  user: {
                    id,
                    firstName:
                      a.evaluatees.find((u) => u.user.id === id)?.user
                        .firstName || "",
                    lastName:
                      a.evaluatees.find((u) => u.user.id === id)?.user
                        .lastName || "",
                    role:
                      a.evaluatees.find((u) => u.user.id === id)?.user.role ||
                      "STUDENT",
                  },
                })),
              }
              : a,
          );

          reset(getValues(), { keepDirty: false });

          return updatedAssessments;
        },
      );

      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
  const now = new Date();
  const { mutate: cancelAssessment } = useMutation({
    mutationFn: () => cancelAdministerForm(selectedAssessment?.id || ""),
    onSuccess: (result) => {
      if (!result.success)
        return toast.error("Something went wrong. Try again.");
      const { hasResponses } = result;
      if (!hasResponses) {
        queryClient.setQueryData(
          ["assessments", formId],
          (oldData: AssessmentsResult | undefined) => {
            if (!oldData) return oldData;

            const updatedAssessments: AssessmentsResult = oldData.filter(
              (a) => a.id !== selectedAssessment?.id,
            );

            setActiveCodeId(oldData.find((a) => isAfter(a.startsAt, now))?.id);
            if (selectedAssessmentId === selectedAssessment?.id) {
              setSelectedAssessmentId(undefined);
            }
            if (
              selectedAssessment?.responses.find(
                (r) => r.id === selectedResponseId,
              )
            ) {
              setSelectedResponseId(undefined);
            }

            return updatedAssessments;
          },
        );
      } else {
        queryClient.setQueryData(
          ["assessments", formId],
          (oldData: AssessmentsResult | undefined) => {
            if (!oldData) return oldData;

            const updatedAssessment = {
              ...selectedAssessment,
              canceledAt: new Date(),
            };

            const updatedAssessments = oldData.filter(
              (a) => a.id !== selectedAssessment?.id,
            );

            setActiveCodeId(
              oldData.find(
                (a) =>
                  isAfter(a.startsAt, now) ||
                  (isAfter(now, a.startsAt) && isBefore(now, a.expiresAt)),
              )?.id,
            );

            return [...updatedAssessments, updatedAssessment];
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  const submit = (data: TEditAssessmentFormSchema) => {
    updateDetails({
      ...data,
      startsAt: parseISO(data.startsAt).toISOString(),
      expiresAt: parseISO(data.expiresAt).toISOString(),
    });
  };

  if (isAssessmentsLoading || isFormLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (error || !formResult) {
    return (
      <>
        <h3 className="text-md mb-2 font-semibold leading-none">Details</h3>
        <div className="flex h-full flex-col items-center justify-center space-y-2 rounded-lg border border-neutral-300 bg-background/10 p-2">
          <p className="text-lg font-normal">
            Something went wrong. Try again.
          </p>
        </div>
      </>
    );
  }

  const scheduledAssessments = assessments?.filter(
    (fc) => isBefore(now, fc.startsAt) && !fc.canceledAt,
  );

  const activeAssessments = assessments?.filter(
    (fc) =>
      isAfter(now, fc.startsAt) &&
      isBefore(now, fc.expiresAt) &&
      !fc.canceledAt,
  );

  if (!scheduledAssessments?.length && !activeAssessments?.length) {
    return (
      <>
        <h3 className="text-md mb-2 font-semibold leading-none">Details</h3>
        <div className="flex h-full flex-col items-center justify-center space-y-2 rounded-lg border border-neutral-300 bg-background/10 p-2">
          <ScientistIllustration />
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium">
              This form has no upcoming assessments.
            </p>
            <p className="text-sm font-normal">
              Click &quot;New Assessment&quot; to get started.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!selectedAssessment) {
    return (
      <>
        <h3 className="text-md mb-2 font-semibold leading-none">Details</h3>
        <div className="flex h-full flex-col items-center justify-center space-y-2 rounded-lg border border-neutral-300 bg-background/10 p-2">
          <NoDataIllustration />
          <p className="text-lg font-normal">
            Select an assessment to get started.
          </p>
        </div>
      </>
    );
  }

  const isActive =
    isAfter(now, selectedAssessment.startsAt) &&
    isBefore(now, selectedAssessment.expiresAt) &&
    !selectedAssessment.canceledAt;

  return (
    <>
      <h3 className="text-md mb-2 font-semibold leading-none">Details</h3>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex h-full flex-col justify-between rounded-lg border border-neutral-300 bg-background/10 p-2"
      >
        <div className="space-y-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Controller
              name="title"
              disabled={isPending}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.title && (
              <FormErrorMessage message={errors.title.message} />
            )}
          </div>
          <div className="flex w-full flex-row items-center space-x-2">
            <div>
              <Label htmlFor="startsAt">Starts At</Label>
              <Controller
                name="startsAt"
                control={control}
                render={({ field }) => (
                  <Input
                    disabled={isPending || isActive}
                    type="datetime-local"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.startsAt && (
                <FormErrorMessage message={errors.startsAt.message} />
              )}
            </div>
            <div>
              <Label htmlFor="expiresAt">Ends At</Label>
              <Controller
                name="expiresAt"
                control={control}
                render={({ field }) => (
                  <Input
                    disabled={isPending}
                    type="datetime-local"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.expiresAt && (
                <FormErrorMessage message={errors.expiresAt.message} />
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="evaluateeIds">Evaluatees</Label>
            <Controller
              name="evaluateeIds"
              control={control}
              render={({ field }) => (
                <>
                  <MultipleSelector
                    disabled={isPending}
                    value={field.value?.map((value) => ({
                      value,
                      label:
                        studentOptions?.find((s) => s.value === value)?.label ||
                        "",
                    }))}
                    onChange={(options) => {
                      const values = options.map((option) => option.value);
                      field.onChange(values);
                    }}
                    defaultOptions={studentOptions}
                    placeholder="Select Students..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No Students Found.
                      </p>
                    }
                  />
                  {errors.evaluateeIds && (
                    <FormErrorMessage message={errors.evaluateeIds.message} />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="xs"
              className={cn("w-32 transition-all hover:bg-accent-secondary/50")}
              variant="accent-secondary-background"
              disabled={isPending || !isDirty}
            >
              {isPending ? (
                <Lottie
                  animationData={LOADING}
                  className="size-8"
                  loop
                  autoplay
                />
              ) : isDirty ? (
                "Save Changes"
              ) : (
                "Saved"
              )}
            </Button>
          </div>
        </div>
        <AssessmentControls
          assessment={selectedAssessment}
          onCancel={cancelAssessment}
          isActive={isActive}
        />
      </form>
    </>
  );
}

function AssessmentControls({
  assessment,
  onCancel,
  isActive,
}: {
  assessment: AssessmentsResult[0];
  onCancel: () => void;
  isActive: boolean;
}) {
  const [hovering, setHovering] = useState<boolean>(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(assessment.code));
    return toast.message("Access code copied to clipboard.");
  };

  return (
    <div className="flex h-full flex-col justify-end space-y-2">
      <div className="space-y-2">
        <h3 className="text-md font-semibold leading-none">Controls</h3>
        <div
          className={cn(
            "flex h-12 flex-row items-center justify-center space-x-2 rounded-md border border-neutral-200",
          )}
        >
          {isActive ? (
            <>
              <p className="text-xl font-medium tracking-widest">
                {assessment.code}
              </p>
              <Button
                name="access-code"
                size="xs"
                type="button"
                onClick={handleCopy}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                <LottieHover src={COPY} size="xs" isHovering={hovering} />
              </Button>
            </>
          ) : (
            <p className="px-16 text-xs font-normal italic">
              When this assessment is active, the access code will appear here.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between space-x-2">
        <div className="flex w-full flex-row items-center justify-between">
          <StartNowButton assessment={assessment} />
          <TwoStageConfirmButton
            size="xs"
            variant="outline"
            className="w-40 hover:bg-neutral-100"
            type="button"
            initialText="Cancel Assessment"
            confirmText="Confirm Cancellation?"
            onConfirm={onCancel}
            progressColor="bg-neutral-300"
          />
        </div>
      </div>
    </div>
  );
}

function StartNowButton({ assessment }: { assessment: AssessmentsResult[0] }) {
  const [hovering, setHovering] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: startNow, isPending } = useMutation({
    mutationFn: async () => {
      const now = new Date();
      return updateAssessmentDetails({
        title: assessment.title,
        assessmentId: assessment.id,
        evaluateeIds: assessment.evaluatees.map((u) => u.user.id),
        startsAt: now.toString(),
        expiresAt: assessment.startsAt.toString(),
      });
    },
    onSuccess: (result) => {
      if (result.status === "error")
        return toast.error("Something went wrong. Try again.");
      queryClient.setQueryData(
        ["assessments", assessment.formId],
        (oldData: AssessmentsResult | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((a) =>
            a.id === result.data.id
              ? {
                  ...a,
                  startsAt: result.data.startsAt,
                }
              : a,
          );
        },
      );
    },
  });

  const handleClick = () => {
    if (assessment.evaluatees.map((u) => u.user.id).length <= 0)
      return toast.error("Add an evaluatee to start this assessment.");
    return startNow();
  };

  const now = new Date();
  const isActive = isAfter(now, assessment.startsAt);

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={isActive || isPending}
      size="xs"
      variant="accent-secondary"
      className="w-28 items-center space-x-2"
      type="button"
    >
      <LottieHover src={PLAY} size="xs" isHovering={hovering} />
      {<p>Start Now</p>}
    </Button>
  );
}

const ZEditAssessmentFormSchema = z
  .object({
    assessmentId: z.string().min(1, {
      message: "An unexpected error occurred. Refresh the page and try again.",
    }),
    title: z.string().min(1, { message: "Enter a title." }),
    startsAt: z.string({ message: "Enter a valid start time." }),
    expiresAt: z.string({ message: "Enter a valid end time." }),
    evaluateeIds: z
      .array(z.string())
      .min(1, { message: "You must assign at least 1 evaluatee." }),
  })
  .refine(
    (data) => {
      return isBefore(new Date(data.startsAt), new Date(data.expiresAt));
    },
    {
      message: "The end time must be after the start time.",
      path: ["expiresAt"],
    },
  );
// .refine(
//   (data) => {
//     const now = new Date();
//     return (
//       !isToday(new Date(data.startsAt)) ||
//       !isAfter(now, new Date(data.startsAt))
//     );
//   },
//   {
//     message: "The start time must be now or in the future.",
//     path: ["startsAt"],
//   },
// );

type TEditAssessmentFormSchema = z.infer<typeof ZEditAssessmentFormSchema>;
