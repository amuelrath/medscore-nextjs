"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { AnimateChangeInHeight } from "@/components/ui/animate-change-in-height";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-selector";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form";
import { getFullName } from "@/lib/getFullName";
import { useMutation } from "@tanstack/react-query";
import { administerForm } from "@/server/actions/forms/administer-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/ui/date-picker";
import { isSameDay } from "date-fns/isSameDay";
import { toast } from "sonner";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { LottieHover } from "@/components/ui/lottie-hover";
import PEN from "public/icons/pencil-teal.json";

export function AdministerDialog() {
  const methods = useFormContext<FormResult>();
  const form = methods.getValues();

  const [hovering, setHovering] = useState<boolean>(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"accent-secondary"} className={cn("w-36")}>
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("flex flex-row items-center space-x-2")}>
            <LottieHover loop={false} isHovering={hovering} size={"sm"} src={PEN} />
            <span className={"text-teal-900 font-semibold"}>Administer</span>
          </div>
        </Button>
      </DialogTrigger>
      <AnimateChangeInHeight>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn("z-50 flex min-w-[530px] flex-col items-start")}
        >
          <DialogHeader className="w-full">
            <DialogTitle className="w-full truncate">
              Administer &quot;{form.title}&quot;
            </DialogTitle>
            <DialogDescription>
              Start or schedule the administration of this assessment.
            </DialogDescription>
            <hr />
          </DialogHeader>
          <AdministerForm />
        </DialogContent>
      </AnimateChangeInHeight>
    </Dialog>
  );
}

const ZAdministerForm = z
  .object({
    formId: z.string({ message: "Invalid form ID. Please try again." }),
    studentIds: z
      .array(z.string())
      .min(1, { message: "Please select at least one evaluatee." }),
    startDate: z.date({ message: "Please enter a valid start date." }),
    startTime: z.date({ message: "Please enter a valid start time." }),
    endTime: z.date({ message: "Please enter a valid end time." }),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "The end time must be after the start time.",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      const durationInMinutes =
        (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60);
      return durationInMinutes >= 5;
    },
    {
      message: "The assessment duration must be at least 5 minutes.",
      path: ["endTime"],
    },
  )
  .refine((data) => data.startDate.getDate() >= new Date().getDate(), {
    message: "The start date must be today or a future date.",
    path: ["startDate"],
  });

type TAdministerForm = z.infer<typeof ZAdministerForm>;

/* TODO
 *    allow for the admin to create student groups,
 *    groups show up as small buttons so the user can
 *    quickly select a group(s) of students.
 */
function AdministerForm() {
  // form state
  const [formCode, setFormCode] = useState<
    { code: string; expiresAt: Date } | undefined
  >(undefined);

  // get the form values
  const methods = useFormContext<FormResult>();
  const form = methods.getValues();

  // get the possible students
  const studentOptions = form.programs.users
    .filter((u) => u.user.role === "STUDENT")
    .map((s) => ({
      value: s.user.id,
      label: getFullName(s.user),
    }));

  // initialize the hook form
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TAdministerForm>({
    resolver: zodResolver(ZAdministerForm),
    defaultValues: {
      formId: form.id,
      studentIds: [],
      startDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    },
  });
  const watchedStartDate = useWatch({
    control,
    name: "startDate",
  });
  // for the initial submit
  const administerMutation = useMutation({
    mutationFn: administerForm,
  });

  const submitForm = async (data: TAdministerForm) => {
    const { formId, studentIds, startDate, startTime, endTime } = data;

    // Combine the start date and start time
    const startsAt = new Date(startDate);
    startsAt.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds(),
    );

    // Combine the start date and end time
    const expiresAt = new Date(startDate);
    expiresAt.setHours(
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds(),
    );

    try {
      const result = await administerMutation.mutateAsync({
        formId,
        userIds: studentIds,
        startsAt,
        expiresAt,
      });
      toast.success(
        `"${form.title}" was ${isSameDay(watchedStartDate, new Date()) ? "administered" : "scheduled"} successfully.`,
      );
      setFormCode(result);
      reset();
    } catch (error) {
      toast.error(`Something went wrong!`);
      // Handle the error, show an error message, etc.
    }
  };

  // for changing details after the initial submit

  // for canceling the form

  return (
    <form
      autoFocus={false}
      autoComplete={"off"}
      onSubmit={handleSubmit(submitForm)}
      className="flex h-full w-full flex-1 flex-col justify-between "
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Assessment Date</div>
            <div className="flex flex-row space-x-4">
              <Controller
                name={"startDate"}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className={cn("w-[250px]")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="flex flex-row items-center space-x-3">
                <Controller
                  name={"startTime"}
                  control={control}
                  render={({ field }) => (
                    <TimePicker value={field.value} onChange={field.onChange} />
                  )}
                />
                <span className="mx-2">-</span>
                <Controller
                  name={"endTime"}
                  control={control}
                  render={({ field }) => (
                    <TimePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
            {errors.startDate && (
              <FormErrorMessage message={errors.startDate.message} />
            )}
          </div>
          {errors.startTime && (
            <FormErrorMessage message={errors.startTime.message} />
          )}
          {errors.endTime && (
            <FormErrorMessage message={errors.endTime.message} />
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">Evaluatees</p>
          <Controller
            name={"studentIds"}
            control={control}
            render={({ field }) => (
              <>
                <MultipleSelector
                  value={field.value.map((value) => ({
                    value,
                    label:
                      studentOptions.find((s) => s.value === value)?.label ||
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
                {errors.studentIds && (
                  <FormErrorMessage message={errors.studentIds.message} />
                )}
              </>
            )}
          />
        </div>
        <div className="flex flex-row items-center justify-end space-x-2">
          <Button className="w-[100px]">
            {isSameDay(watchedStartDate, new Date())
              ? "Administer"
              : "Schedule"}
          </Button>
          <DialogClose asChild>
            <Button variant={"secondary"}>Close</Button>
          </DialogClose>
        </div>
      </div>
    </form>
  );
}
