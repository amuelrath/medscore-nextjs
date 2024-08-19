"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormMultiselect } from "@/components/ui/form-multiselect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSelect } from "@/components/ui/user-select";
import {
  ZRespondeeParticipationSchema,
  ZSpecificPairParticipationSchema,
} from "@/lib/zod/participation-schema";
import { createAssessmentWithRequests } from "@/server/actions/assessments/create-assessment-with-requests";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PlusCircleIcon, SendHorizonalIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ZRequestResponseFormSchema = z
  .object({
    formId: z.array(z.string().uuid()).max(1),
    title: z.string().optional(),
    formType: z
      .enum(["OSCE", "SURVEY", "EVALUATION", "DIRECT_OBSERVATION"])
      .nullable(),
    startsAt: z.string(),
    expiresAt: z.string(),
    specificPairParticipants: ZSpecificPairParticipationSchema.optional(),
    respondeeParticipants: ZRespondeeParticipationSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.formType === ("OSCE" || "EVALUATION")) {
        return (data.specificPairParticipants?.length || 0) > 0;
      }
      return true;
    },
    {
      message:
        "EVALUATION or OSCE form type must have specific pair participants",
      path: ["specificPairParticipants"],
    },
  )
  .refine(
    (data) => {
      const isSpecificPair = Boolean(
        (data.specificPairParticipants?.length || 0) > 0,
      );
      const isRespondees = Boolean(data.respondeeParticipants);

      // Ensure only one type of participation is selected
      if (isSpecificPair) {
        return Boolean(!isRespondees);
      }
    },
    {
      message:
        "Only one type of participation (specific pair, assessor pool, or respondees) should be selected",
      path: ["specificPairParticipants", "respondeeParticipants"],
    },
  );

export type TRequestResponseFormSchema = z.infer<
  typeof ZRequestResponseFormSchema
>;

// todo disallow selecting the logged in user's id
export function RequestResponseDialog() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const methods = useForm<TRequestResponseFormSchema>({
    resolver: zodResolver(ZRequestResponseFormSchema),
  });

  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const queryClient = useQueryClient();
  const { mutate: sendAssessmentRequest } = useMutation({
    mutationFn: createAssessmentWithRequests,
    onMutate: (data) => {
      setDialogOpen(false);
      // put new requests into the queryCache
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
    onSettled: () => {
      toast.success("Success!");
    },
  });

  // Watch for changes in the formId field
  const selectedFormId = methods.watch("formId");

  useEffect(() => {
    methods.resetField(`respondeeParticipants`);
    methods.resetField(`specificPairParticipants`);
  }, [methods, selectedFormId]);

  useEffect(() => {
    const selectedFormType = forms.find(
      (f) =>
        f.id ===
        ((Array.isArray(selectedFormId) && selectedFormId[0]) || undefined),
    )?.type;
    if (selectedFormType) return methods.setValue("formType", selectedFormType);
  }, [forms, methods, selectedFormId]);

  const onSubmit = (data: TRequestResponseFormSchema) => {
    sendAssessmentRequest(data);
    methods.reset();
    methods.resetField("startsAt");
    methods.resetField("expiresAt");
  };

  const renderParticipantsInput = () => {
    if (!selectedFormId || selectedFormId.length === 0) {
      return <></>;
    }

    const selectedForm = forms.find(
      (f) =>
        f.id === (Array.isArray(selectedFormId) && selectedFormId[0]) ||
        undefined,
    );

    if (!selectedForm) {
      return <div>Selected form not found</div>;
    }

    switch (selectedForm.type) {
      case "OSCE":
        return <SpecificPairsManagerInput />;
      case "SURVEY":
        return <RespondeeInput />;
      case "EVALUATION":
        return <SpecificPairsManagerInput />;
      default:
        return <div>Unsupported form type</div>;
    }
  };

  return (
    <Dialog onOpenChange={(open) => setDialogOpen(open)} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="xs"
          variant="accent-secondary"
          className="font-semibold text-teal-900 space-x-2"
        >
          <SendHorizonalIcon size={14} strokeWidth={2.5} />
          <p>Request Assessment</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        noCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex h-[525px] max-w-[500px] flex-col"
      >
        <DialogHeader>
          <DialogTitle className="pointer-events-none flex items-center space-x-2">
            <SendHorizonalIcon size={14} />
            <p>New Assessment</p>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex-grow flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="col-span-1 flex flex-col mr-6 bg-primary/5 rounded-sm justify-center items-center">
                <FormMultiselect control={methods.control} name="formId" />
                <input type="hidden" {...methods.register("formType")} />
              </div>
              <div className="col-span-1 flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="startsAt">
                    Begin to allow responses at
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    {...methods.register("startsAt")}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label variant="light" htmlFor="startsAt">
                    Responses should be submitted by
                  </Label>
                  <Input
                    size="sm"
                    type="datetime-local"
                    {...methods.register("expiresAt")}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label
                className="text-neutral-500 text-2xs font-normal"
                htmlFor="title"
              >
                Assessment Title
              </Label>
              <Input
                size="sm"
                placeholder="Untitled Assessment"
                {...methods.register("title")}
              />
            </div>
            <div className="flex-grow">{renderParticipantsInput()}</div>

            <div className="flex select-none flex-row justify-end items-baseline space-x-2">
              <Button disabled={methods.formState.isSubmitting} type="submit">
                Send
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function RespondeeInput() {
  const { control, getValues } = useFormContext<TRequestResponseFormSchema>();
  const selectedFormId = getValues(`formId`);

  return (
    <>
      <div className="flex flex-col border-t pt-2 space-y-2">
        <Label variant="light">Respondees</Label>
        <UserSelect
          control={control}
          formId={selectedFormId[0]}
          name="respondeeParticipants"
        />
      </div>
    </>
  );
}

function SpecificPairsManagerInput() {
  const { control } = useFormContext<TRequestResponseFormSchema>();
  const { fields, append, remove } = useFieldArray<TRequestResponseFormSchema>({
    control,
    name: "specificPairParticipants",
  });

  const specificPairParticipants = useWatch({
    control,
    name: `specificPairParticipants`,
  });

  if (fields.length === 0) {
    append({
      evaluateeIds: [],
      evaluatorId: [],
    });
  }

  const usedEvaluatorIds =
    specificPairParticipants
      ?.map((pair) => pair.evaluatorId[0])
      .filter(Boolean) || [];

  return (
    <div className="flex flex-col w-full select-none border-b h-44">
      <div className="grid text-sm border-b pb-1 sticky -top-[0.02px] bg-white flex-grow z-20 text-neutral-500 grid-cols-4">
        <div className="col-span-1">
          <Label variant="light">Evaluator</Label>
        </div>
        <div className="col-span-2">
          <Label variant="light">Evaluatee(s)</Label>
        </div>
        <div className="col-span-1 flex flex-row justify-end">
          <span
            role="button"
            onClick={() => append({ evaluateeIds: [], evaluatorId: [] })} // something weird with UserSelect not liking strings
          >
            <PlusCircleIcon
              size={16}
              className=" text-foreground/50 hover:text-foreground/30 transition"
            />
          </span>
        </div>
      </div>
      <div className="h-40 pt-4 -mr-[0.9rem] pl-1 overflow-y-scroll">
        {fields.map((f, index) => (
          <SpecificPairInput
            key={f.id}
            index={index}
            remove={() => remove(index)}
            usedEvaluatorIds={usedEvaluatorIds}
          />
        ))}
      </div>
    </div>
  );
}

function SpecificPairInput({
  index,
  remove,
  usedEvaluatorIds,
}: {
  index: number;
  remove: () => void;
  usedEvaluatorIds: string[];
}) {
  const { control, getValues } = useFormContext<TRequestResponseFormSchema>();
  const selectedFormId = getValues(`formId`);

  const evaluateeIds =
    useWatch({
      control,
      name: `specificPairParticipants.${index}.evaluateeIds`,
    }) || []; // Ensure it's always an array

  const evaluatorId =
    useWatch({
      control,
      name: `specificPairParticipants.${index}.evaluatorId`,
    }) || []; // Ensure it's always an array

  const disabledEvaluatorIds = [
    ...evaluateeIds,
    ...usedEvaluatorIds.filter((id) => id !== evaluatorId[0]),
  ];

  return (
    <div className="grid grid-cols-4 mb-6 w-full">
      <div className="col-span-1 content-center">
        <UserSelect
          control={control}
          formId={selectedFormId[0]}
          max={1}
          name={`specificPairParticipants.${index}.evaluatorId`}
          disabledIds={disabledEvaluatorIds}
        />
      </div>
      <div className="col-span-2 content-center">
        <UserSelect
          control={control}
          formId={selectedFormId[0]}
          name={`specificPairParticipants.${index}.evaluateeIds`}
          disabledIds={evaluatorId}
        />
      </div>
      <div className="justify-end flex items-center col-span-1">
        <XIcon
          size={16}
          className="opacity-50 cursor-pointer hover:text-destructive hover:opacity-100 transition-all"
          onClick={remove}
        />
      </div>
    </div>
  );
}
