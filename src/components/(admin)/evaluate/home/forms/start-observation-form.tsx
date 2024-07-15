"use client";
import { z } from "zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { addHours, addMinutes } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFullName } from "@/lib/helpers/getFullName";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { startDirectObservation } from "@/server/actions/evaluate/start-direct-observation";
import { useFormResultSuspenseQuery } from "@/hooks/queries/use-form-result-suspense-query";

const ZStartObservationSchema = z.object({
  evaluateeId: z.string().min(1, { message: "Select an evaluatee." }),
  evaluatorId: z
    .string()
    .min(1, { message: "Something went wrong, please reload the page." }),
  formId: z.string().min(1, {
    message:
      "Something went wrong fetching the assessment, please reload the page.",
  }),
});
type TStartObservationSchema = z.infer<typeof ZStartObservationSchema>;

export function InEditorForm({ formId }: { formId: string }) {
  // spin up a router for redirecting
  const router = useRouter();

  // spin up a query client
  const queryClient = useQueryClient();

  // get form's data
  const { formResult } = useFormResultSuspenseQuery(formId);

  // initialize a hook form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TStartObservationSchema>({
    resolver: zodResolver(ZStartObservationSchema),
    defaultValues: {
      formId,
      evaluateeId: "",
      evaluatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!, // TODO populate this properly
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: startDirectObservation,
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["form", formId],
        (oldData: FormResult | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            formCodes: [...oldData.formCodes, result.formCode],
          };
        },
      );
    },
  });

  // only allow user to pick the resident
  const students = formResult?.programs.users
    .flatMap((u) => u.user)
    .filter((u) => u.role === "STUDENT");

  const submitForm = async (data: TStartObservationSchema) => {
    // create a direct observation formCode and response
    const now = new Date();
    await mutateAsync({
      formId,
      title: `${getFullName(students!.find((s) => s.id === data.evaluateeId)!)}`, // zod will throw errors for us
      startsAt: addMinutes(now, -3),
      expiresAt: addHours(now, 2),
      userIds: [data.evaluateeId],
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!, // TODO FIXME
    }).then((result) => {
      router.push(`/evaluate/${result.response.id}`);
    });
  };

  return (
    <form
      autoFocus={false}
      autoComplete="off"
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col space-y-6"
    >
      <div className="space-y-2">
        <p className="text-md font-semibold">Evaluatee</p>
        <Controller
          name={`evaluateeId`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger type="button">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {getFullName(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.evaluateeId && (
          <FormErrorMessage message={errors.evaluateeId.message} />
        )}
      </div>
      <div className="flex justify-end space-x-2 ">
        <Button disabled={isPending} className="w-[100px]">
          Start
        </Button>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}

export function NotInEditorForm() {
  const { data: allForms } = useSuspenseQuery({
    queryKey: ["forms", "lite"],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TStartObservationSchema>({
    resolver: zodResolver(ZStartObservationSchema),
    defaultValues: {
      formId: "",
      evaluateeId: "",
      evaluatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: startDirectObservation,
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["form", result.formCode.formId],
        (oldData: FormResult | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            formCodes: [...oldData.formCodes, result.formCode],
          };
        },
      );
    },
  });

  const selectedFormId = useWatch({ control, name: "formId" });
  const [students, setStudents] = useState<any[]>([]);

  // Update students when selectedFormId changes
  useEffect(() => {
    if (selectedFormId) {
      const selectedForm = allForms.find((f) => f.id === selectedFormId);
      if (selectedForm) {
        const formStudents = selectedForm.programs.users
          .flatMap((u) => u.user)
          .filter((u) => u.role === "STUDENT");
        setStudents(formStudents);
      }
    } else {
      setStudents([]);
    }
  }, [selectedFormId, allForms]);

  const submitForm = (data: TStartObservationSchema) => {
    const now = new Date();
    mutate({
      formId: data.formId,
      title: `Direct Observation of ${getFullName(students.find((s) => s.id === data.evaluateeId)!)}`,
      startsAt: addMinutes(now, -0.5),
      expiresAt: addHours(now, 2),
      userIds: [data.evaluateeId],
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    });
  };

  useEffect(() => {
    if (data && data.response) {
      router.push(`/evaluate/${data.response.id}`);
    }
  }, [router, data]);

  return (
    <form
      autoFocus={false}
      autoComplete="off"
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col space-y-6"
    >
      <div className="space-y-2">
        <p className="text-md font-semibold">Assessment</p>
        <Controller
          name="formId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger type="button">
                <SelectValue placeholder="Select Assessment" />
              </SelectTrigger>
              <SelectContent>
                {allForms?.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.formId && <FormErrorMessage message={errors.formId.message} />}
      </div>
      <div className="space-y-2">
        <p className="text-md font-semibold">Evaluatee</p>
        <Controller
          name="evaluateeId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger type="button">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {getFullName(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.evaluateeId && (
          <FormErrorMessage message={errors.evaluateeId.message} />
        )}
      </div>
      <div className="flex justify-end space-x-2 ">
        <Button disabled={isPending} className="w-[100px]">
          Start
        </Button>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}
