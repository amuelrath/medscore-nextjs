'use client';

import { EvaluateNav } from '@/components/(admin)/evaluate/forms/evaluate-nav';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormErrorMessage } from '@/components/ui/form-error-message';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getFullName } from '@/lib/helpers/getFullName';
import { getEvaluationForm } from '@/server/actions/evaluate/get-evaluation-form';
import { submitResponse } from '@/server/actions/responses/submit-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ZEvaluationFormSchema = z.object({
  id: z.string().uuid({
    message: 'ERR: Response Id could not be located. Refresh the page.',
  }),
  duration: z.number(),
  optionAnswers: z.array(
    z
      .object({
        formItemId: z
          .string()
          .uuid({ message: 'ERR: A Question Id could not be located.' }),
        type: z.enum(['WRITTEN', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'RANGE']),
        optionIds: z.array(z.string().uuid()).optional(),
        textValue: z.string().optional(),
        isRequired: z.boolean(),
      })
      .superRefine((answer, ctx) => {
        if (answer.isRequired) {
          if (answer.type === 'WRITTEN' && !answer.textValue) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'This question is required.',
              path: ['textValue'],
            });
          } else if (
            ['MULTIPLE_CHOICE', 'SINGLE_CHOICE'].includes(answer.type) &&
            (!answer.optionIds || answer.optionIds.length === 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'This question is required.',
              path: ['optionIds'],
            });
          }
        }

        if (
          answer.type === 'SINGLE_CHOICE' &&
          answer.optionIds &&
          answer.optionIds.length > 1
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select only one option.',
            path: ['optionIds'],
          });
        }

        if (
          answer.type === 'WRITTEN' &&
          answer.optionIds &&
          answer.optionIds.length > 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Written questions should not have any selected options.',
            path: ['optionIds'],
          });
        }
      }),
  ),
});
export type TEvaluationFormSchema = z.infer<typeof ZEvaluationFormSchema>;

export function EvaluationForm({ responseId }: { responseId: string }) {
  const { data: evaluation } = useSuspenseQuery({
    queryKey: ['evaluation-form', responseId],
    queryFn: () => getEvaluationForm({ responseId }),
  });

  const { indexMap, nonHeaderItems } = useMemo(() => {
    const map = new Map<string, number>();
    const nonHeaders = evaluation.form.formItems.filter(
      (item) => item.type !== 'HEADER',
    );
    nonHeaders.forEach((item, index) => {
      map.set(item.id, index);
    });
    return { indexMap: map, nonHeaderItems: nonHeaders };
  }, [evaluation.form.formItems]);

  const methods = useForm<TEvaluationFormSchema>({
    resolver: zodResolver(ZEvaluationFormSchema),
    mode: 'onChange',
    defaultValues: {
      id: responseId,
      duration: 0,
      optionAnswers: nonHeaderItems.map((i) => ({
        type: i.type as 'WRITTEN' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE',
        formItemId: i.id,
        optionIds: [],
        textValue: '',
        isRequired: !!i.isRequired,
      })),
    },
  });

  const { mutate: submitMutate, isPending } = useMutation({
    mutationFn: submitResponse,
    onSuccess: (data) => {
      if (!data.success) return toast.error('Oops! Something went wrong.');
      return toast.success('Evaluation submitted successfully.');
    },
    onError: () => toast.error('Oops! Something went wrong.'),
  });

  const onSubmit = async (data: TEvaluationFormSchema) => {
    submitMutate(data);
  };

  const getEvaluatee = () => {
    if (!evaluation || !evaluation) throw new Error('No form!');
    if (evaluation.form.assessments[0]) {
      const evaluatee = evaluation.form.assessments[0].responses.find(
        (r) => r.id === responseId,
      )?.evaluatee;
      if (!evaluatee) throw new Error("Evaluatee couldn't be found.");
      return evaluatee;
    }
    throw new Error("Evaluatee couldn't be found.");
  };

  const getEvaluator = () => {
    if (!evaluation || !evaluation) throw new Error('No form!');
    if (evaluation.form.assessments[0]) {
      const respondee = evaluation.form.assessments[0].responses.find(
        (r) => r.id === responseId,
      )?.respondee;
      if (!respondee) throw new Error("respondee couldn't be found.");
      return respondee;
    }
    throw new Error("respondee couldn't be found.");
  };

  const { errors } = methods.formState;

  if (evaluation.form.assessments[0]) {
    const isResponseCompleted = evaluation.response.status === 'COMPLETED';
    if (isResponseCompleted)
      throw new Error('Response has already been completed.');
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <EvaluateNav
          formTitle={evaluation?.form.title || ''}
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
                  return fi.type === 'HEADER' ? (
                    <Card
                      key={fi.id}
                      className="mb-4"
                    >
                      <CardHeader>
                        <CardTitle>{fi.text}</CardTitle>
                        <CardDescription>{fi.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ) : null;
                }

                // @ts-expect-error i have no idea but this works and 'isRequired' doesn't
                const fieldError = errors.optionAnswers?.[answerIndex]?.value;

                switch (fi.type) {
                  case 'SINGLE_CHOICE':
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
                                onValueChange={(value) => {
                                  field.onChange([value]);
                                }}
                                value={field.value?.[0] || ''}
                                className="flex flex-col relative"
                              >
                                {fi.options.map((o) => (
                                  <div
                                    key={o.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      indicatorClassName="top-[-1px]"
                                      value={o.id}
                                      id={o.id}
                                      label={o.text || ''}
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
                                ref={field.ref}
                                onChange={field.onChange}
                                name={field.name}
                                value={field.value}
                              />
                            )}
                          />
                          {fieldError && (
                            <FormErrorMessage message={fieldError.message} />
                          )}
                        </CardContent>
                      </Card>
                    );
                  case 'MULTIPLE_CHOICE':
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
                                      checked={(() => {
                                        const selectedOptions =
                                          methods.getValues(
                                            `answers.${answerIndex}.optionIds`,
                                          ) || [];
                                        const naOption = fi.options.find(
                                          (opt) => opt.isNa,
                                        );
                                        const isNaSelected =
                                          naOption &&
                                          selectedOptions.includes(naOption.id);

                                        if (isNaSelected) {
                                          return o.id === naOption.id;
                                        }

                                        return selectedOptions.includes(o.id);
                                      })()}
                                      disabled={(() => {
                                        const selectedOptions =
                                          methods.getValues(
                                            `answers.${answerIndex}.optionIds`,
                                          ) || [];
                                        const naOption = fi.options.find(
                                          (opt) => opt.isNa,
                                        );
                                        const isNaSelected =
                                          naOption &&
                                          selectedOptions.includes(naOption.id);

                                        return (
                                          isNaSelected && o.id !== naOption.id
                                        );
                                      })()}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || [];
                                        let updatedValue;

                                        if (checked) {
                                          // If this is the NA option, clear all other options
                                          if (o.isNa) {
                                            updatedValue = [o.id];
                                          } else {
                                            // Add this option, remove NA if it's there
                                            updatedValue = [
                                              ...currentValue.filter(
                                                (id) =>
                                                  id !==
                                                  fi.options.find(
                                                    (opt) => opt.isNa,
                                                  )?.id,
                                              ),
                                              o.id,
                                            ];
                                          }
                                        } else {
                                          // Remove this option
                                          updatedValue = currentValue.filter(
                                            (id) => id !== o.id,
                                          );
                                        }

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
                                ref={field.ref}
                                onChange={field.onChange}
                                name={field.name}
                                value={field.value}
                              />
                            )}
                          />
                          {fieldError && (
                            <FormErrorMessage message={fieldError.message} />
                          )}
                        </CardContent>
                      </Card>
                    );
                  case 'WRITTEN':
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
                                ref={field.ref}
                                onChange={field.onChange}
                                name={field.name}
                                value={field.value}
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
