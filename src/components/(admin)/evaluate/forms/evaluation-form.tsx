"use client";
import React, { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getEvaluationForm } from "@/server/actions/evaluate/get-evaluation-form";
import { EvaluateNav } from "@/components/(admin)/evaluate/forms/evaluate-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-text-area";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { getFullName } from "@/lib/helpers/getFullName";
import { submitResponse } from "@/server/actions/responses/submit-response";
import { toast } from "sonner";

const ZEvaluationFormSchema = z.object({
  id: z.string().uuid({
    message: "ERR: Response Id could not be located. Refresh the page.",
  }),
  duration: z.number(),
  answers: z.array(
    z
      .object({
        formItemId: z // maybe remove this field? it is unused in the submission data
          .string()
          .uuid({ message: "ERR: A Question Id could not be located." }),
        type: z.enum(["WRITTEN", "MULTIPLE_CHOICE", "SINGLE_CHOICE", "RANGE"]),
        optionIds: z.array(z.string().uuid()).optional(),
        textValue: z.string().optional(),
        isRequired: z.boolean(),
      })
      .refine(
        (answer) => {
          if (answer.isRequired) {
            if (answer.type === "WRITTEN") {
              return !!answer.textValue;
            } else {
              return (answer.optionIds?.length || 0) > 0;
            }
          }
          return true;
        },
        {
          message: "This question is required.",
          path: ["value"],
        },
      )
      .refine(
        (answer) => {
          if (answer.type === "SINGLE_CHOICE") {
            return (answer.optionIds?.length || 0) <= 1;
          }
          return true;
        },
        {
          message: "Please select only one option.",
          path: ["value"],
        },
      )
      .refine(
        (answer) => {
          if (answer.type === "WRITTEN") {
            return !answer.optionIds || answer.optionIds.length === 0;
          }
          return true;
        },
        {
          message: "Written questions should not have any selected options.",
          path: ["value"],
        },
      ),
  ),
});

export type TEvaluationFormSchema = z.infer<typeof ZEvaluationFormSchema>;

export function EvaluationForm({ responseId }: { responseId: string }) {
  const { data: evaluation } = useSuspenseQuery({
    queryKey: ["evaluation-form", responseId],
    queryFn: () => getEvaluationForm({ responseId }),
  });

  /* Since we have formItems we want to ignore, such as HEADER, we need to
   * remap over all of the items and then shift the array back.If we don't do
   * this, hook form expects that the HEADER will have required fields and
   * doesn't allow form submission.
   */
  const { indexMap, nonHeaderItems } = useMemo(() => {
    const map = new Map<string, number>();
    const nonHeaders = evaluation.form.formItems.filter(
      (item) => item.type !== "HEADER",
    );
    nonHeaders.forEach((item, index) => {
      map.set(item.id, index);
    });
    return { indexMap: map, nonHeaderItems: nonHeaders };
  }, [evaluation.form.formItems]);

  const methods = useForm<TEvaluationFormSchema>({
    resolver: zodResolver(ZEvaluationFormSchema),
    defaultValues: {
      id: responseId,
      duration: 0,
      answers: nonHeaderItems.map((i) => ({
        type: i.type as "WRITTEN" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
        formItemId: i.id,
        optionIds: [],
        textValue: "",
        isRequired: !!i.isRequired,
      })),
    },
  });

  const { mutate: submitMutate, isPending } = useMutation({
    mutationFn: submitResponse,
    onSuccess: (data) => {
      if (!data.success) return toast.error("Oops! Something went wrong.");
      // take the user to the response submitted page? allow another submission.
      return toast.success("Evaluation submitted successfully.")
    },
    onError: () => {
      return toast.error("Oops! Something went wrong.");
    },
  });

  const onSubmit = async (data: TEvaluationFormSchema) => {
    submitMutate(data);
  };

  const getEvaluatee = () => {
    if (!evaluation || !evaluation) throw new Error("No form!");
    if (evaluation.form.formCodes[0]) {
      // in the query we only get the form code for this particular response
      return evaluation.form.formCodes[0].usersWithCode.find(
        (u) => u.user.id === evaluation.response.evaluateeId,
      )?.user;
    }
  };

  const getEvaluator = () => {
    if (!evaluation || !evaluation) throw new Error("No form!");
    if (evaluation.form.formCodes[0]) {
      return evaluation.response.creator;
    }
  };

  const errors = methods.formState.errors;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <EvaluateNav
          formTitle={evaluation?.form.title || ""}
          evaluatorName={getFullName(getEvaluator())}
          evaluateeName={getFullName(getEvaluatee())}
        />
        <div className="flex h-[84.5vh] flex-col items-center overflow-y-scroll pb-52 pt-4">
          <div className="w-[45%] pr-[31px]">
            {evaluation.form.formItems
              .sort((a, b) => a.position - b.position)
              .map((fi) => {
                const answerIndex = indexMap.get(fi.id);

                if (answerIndex === undefined) {
                  return fi.type === "HEADER" ? (
                    <Card
                      key={fi.id}
                      className="mb-4 border-t-[12px] border-t-primary/80"
                    >
                      <CardHeader>
                        <CardTitle>{fi.text}</CardTitle>
                        <CardDescription>{fi.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ) : null;
                }

                // @ts-expect-error i have no idea but this works and 'isRequired' doesn't
                const fieldError = errors.answers?.[answerIndex]?.value;

                switch (fi.type) {
                  case "SINGLE_CHOICE":
                    return (
                      <Card key={fi.id} className="mb-4">
                        <CardHeader>
                          <CardTitle className="text-lg font-medium">
                            {fi.text}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Controller
                            name={`answers.${answerIndex}.optionIds` as const}
                            control={methods.control}
                            render={({ field }) => (
                              <RadioGroup
                                onValueChange={(value) =>
                                  field.onChange([value])
                                }
                                value={field.value?.[0] || ""}
                                className="flex flex-col"
                              >
                                {fi.options.map((o) => (
                                  <div
                                    key={o.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={o.id}
                                      id={o.id}
                                      label={o.text || ""}
                                    />
                                  </div>
                                ))}
                              </RadioGroup>
                            )}
                          />
                          <Controller
                            name={`answers.${answerIndex}.textValue` as const}
                            control={methods.control}
                            render={({ field }) => (
                              <AutosizeTextarea
                                placeholder="Comments/Feedback (optional)"
                                {...field}
                              />
                            )}
                          />
                          {fieldError && (
                            <FormErrorMessage message={fieldError.message} />
                          )}
                        </CardContent>
                      </Card>
                    );
                  case "MULTIPLE_CHOICE":
                    return (
                      <Card key={fi.id} className="mb-4">
                        <CardHeader>
                          <CardTitle className="text-lg font-medium">
                            {fi.text}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Controller
                            name={`answers.${answerIndex}.optionIds` as const}
                            control={methods.control}
                            render={({ field }) => (
                              <div className="flex flex-col space-y-2">
                                {fi.options.map((o) => (
                                  <div
                                    key={o.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={o.id}
                                      checked={field.value?.includes(o.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), o.id]
                                          : (field.value || []).filter(
                                              (id) => id !== o.id,
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                    <Label htmlFor={o.id}>{o.text}</Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                          <Controller
                            name={`answers.${answerIndex}.textValue` as const}
                            control={methods.control}
                            render={({ field }) => (
                              <AutosizeTextarea
                                placeholder="Comments/Feedback (optional)"
                                {...field}
                              />
                            )}
                          />
                          {fieldError && (
                            <FormErrorMessage message={fieldError.message} />
                          )}
                        </CardContent>
                      </Card>
                    );
                  case "WRITTEN":
                    return (
                      <Card key={fi.id} className="mb-4">
                        <CardHeader>
                          <CardTitle className="text-lg font-medium">
                            {fi.text}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Controller
                            name={`answers.${answerIndex}.textValue` as const}
                            control={methods.control}
                            render={({ field }) => (
                              <AutosizeTextarea
                                placeholder="Written response."
                                {...field}
                              />
                            )}
                          />
                          {fieldError && (
                            <FormErrorMessage message={fieldError.message} />
                          )}
                        </CardContent>
                      </Card>
                    );
                  default:
                    throw new Error(
                      `Question type '${fi.type}' is unsupported.`,
                    );
                }
              })}
          </div>
          <Button
            type="submit"
            className="mt-4 w-64"
            disabled={isPending || methods.formState.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
