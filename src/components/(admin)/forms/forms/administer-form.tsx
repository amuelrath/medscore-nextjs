import { z } from "zod";
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { getFullName } from "@/lib/getFullName";
import { zodResolver } from "@hookform/resolvers/zod";
import { administerForm } from "@/server/actions/forms/administer-form";
import { toast } from "sonner";
import { isSameDay } from "date-fns/isSameDay";
import { Input } from "@/components/ui/input";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";

const ZAdministerForm = z
  .object({
    formId: z.string({ message: "Invalid form ID. Please try again." }),
    title: z.string({
      message: "Please enter a name for this administration.",
    }),
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
export function AdministerForm() {
  // form state
  const { getValues } = useFormContext<TFormRelate>();
  const formId = getValues(`id`);
  const [, setFormCode] = useState<
    { code: string; expiresAt: Date } | undefined
  >(undefined);

  // grab the formId
  const userId = process.env.NEXT_PUBLIC_DEV_USER_ID!;

  // get the form values from the query cache
  const { data: form } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () => getFormById({ formId, userId }),
  });

  // get the possible students
  const studentOptions = form?.programs.users
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
    register,
  } = useForm<TAdministerForm>({
    resolver: zodResolver(ZAdministerForm),
    defaultValues: {
      formId: form?.id || "",
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
    const { formId, studentIds, startDate, startTime, endTime, title } = data;

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
        title,
      });
      toast.success(
        `"${form?.title}" was ${isSameDay(watchedStartDate, new Date()) ? "administered" : "scheduled"} successfully.`,
      );
      setFormCode(result);
      reset();
    } catch (error) {
      toast.error(`Something went wrong!`);
      // Handle the error, show an error message, etc.
    }
  };

  // for canceling the form

  return (
    <form
      autoFocus={false}
      autoComplete="off"
      onSubmit={handleSubmit(submitForm)}
      className="flex h-full w-full flex-col justify-between"
    >
      <div className="space-y-2">
        <p className="text-md font-semibold">Administration Title</p>
        <Input
          {...register(`title`)}
          className="bg-blue-800/5 shadow-inner"
          defaultValue="Untitled Administration"
        />
        {errors.title && <FormErrorMessage message={errors.title.message} />}
      </div>

      <div className="space-y-2">
        <p className="text-md font-semibold">Administration Date</p>
        <div className="flex flex-row space-x-4">
          <Controller
            name="startDate"
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
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePicker value={field.value} onChange={field.onChange} />
              )}
            />
            <span className="mx-2">-</span>
            <Controller
              name="endTime"
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
        {errors.startTime && (
          <FormErrorMessage message={errors.startTime.message} />
        )}
        {errors.endTime && (
          <FormErrorMessage message={errors.endTime.message} />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-md font-semibold">Evaluatees</p>
        <Controller
          name="studentIds"
          control={control}
          render={({ field }) => (
            <>
              <MultipleSelector
                value={field.value.map((value) => ({
                  value,
                  label:
                    studentOptions?.find((s) => s.value === value)?.label || "",
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

      <div className="flex justify-end">
        <Button className="w-[100px]">
          {isSameDay(watchedStartDate, new Date()) ? "Administer" : "Schedule"}
        </Button>
      </div>
    </form>
  );
}
