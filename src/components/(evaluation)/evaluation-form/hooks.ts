import {
  TEvaluationForm,
  transformToSchema,
  ZEvaluationFormSchema,
} from '@/components/(evaluation)/evaluation-form/schemas';
import { ZFormSettingsSchema } from '@/lib/helpers/zod/form-schema';
import {
  EvaluationFormResult,
  getEvaluationForm,
} from '@/server/actions/evaluate/get-evaluation-form';
import { saveResponse } from '@/server/actions/responses/save-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { isAfter, isBefore } from 'date-fns';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod'

type TMode = 'readonly' | 'edit' | 'default';

interface ValidateResponseIsAllowed {
  form: Pick<EvaluationFormResult['form'], 'settings'>;
  response: Pick<EvaluationFormResult['response'], 'status' | 'assessment'>;
  mode: TMode;
}

const validateResponseIsAllowed = ({
  form,
  response,
  mode,
}: ValidateResponseIsAllowed): void => {
  const now = new Date();
  const { allowResponseRevisions, allowResponseSaveAndQuit } =
    ZFormSettingsSchema.parse(form.settings);
  const assessmentStarted = isAfter(now, response.assessment.startsAt);
  const responseStillAllowed = isBefore(now, response.assessment.expiresAt);

  if (!assessmentStarted) {
    throw new Error('The assessment has not started yet.');
  }

  if (!responseStillAllowed) {
    throw new Error('The assessment has expired.');
  }

  if (response.status === 'COMPLETED') {
    if (mode === 'default') {
      throw new Error('Cannot open a completed response in default mode.');
    }
    if (mode === 'edit' && !allowResponseRevisions) {
      throw new Error('Editing completed responses is not allowed.');
    }
  }

  if (response.status === 'STARTED') {
    if (mode === 'default' && !allowResponseSaveAndQuit) {
      throw new Error(
        "Cannot reopen a saved response when 'Save and Quit' is not allowed.",
      );
    }
  }

  if (mode === 'readonly' && response.status !== 'COMPLETED') {
    throw new Error('Only completed responses can be viewed in readonly mode.');
  }
};

interface UseEvaluationForm {
  responseId: string;
  mode?: TMode;
  maxDebounceTime?: number;
  incrementDebounceTime?: number;
  maxActiveTime?: number;
}

export function useEvaluationForm({
  responseId,
  mode = 'default',
  maxDebounceTime = 2000,
}: UseEvaluationForm) {
  const { data } = useSuspenseQuery({
    queryKey: ['evaluation-form', responseId],
    queryFn: () => getEvaluationForm({ responseId }),
  });

  const { form, response } = data;

  const methods = useForm<TEvaluationForm>({
    defaultValues: useMemo(
      () => transformToSchema({ form, response }),
      [form, response],
    ),
    resolver: zodResolver(ZEvaluationFormSchema),
  });

  const answersRef = useRef(methods.getValues('answers'));
  // eslint-disable-next-line no-undef
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: mutateAutosaveResponse } = useMutation({
    mutationFn: saveResponse,
    onError: () => toast.error('Error saving changes.'),
  });

  useEffect(() => {
    validateResponseIsAllowed({ form, response, mode });
  }, [form, response, mode]);

  const saveForm = useCallback(
    (formData: TEvaluationForm['answers']) => {
      const responseToSave = ZEvaluationFormSchema.safeParse({
        ...methods.getValues(),
        answers: formData,
      });
      if (responseToSave.success) {
        mutateAutosaveResponse(responseToSave.data);
      }
    },
    [methods, mutateAutosaveResponse],
  );

  const submitForm = async () => {
    const answers = methods.getValues('answers');
    let hasErrors = false;

    answers.forEach((answer, index) => {
      const formItem = form.formItems.find((f) => f.id === answer.formItemId);
      const isRequired = formItem?.isRequired || false;

      if (
        isRequired &&
        answer.type === 'SINGLE_CHOICE' &&
        !answer.selectedOptionId
      ) {
        methods.setError(`answers.${index}.selectedOptionId`, {
          type: 'required',
          message: 'This question is required',
        });
        hasErrors = true;
      } else {
        // Clear the error if it's no longer applicable
        methods.clearErrors(`answers.${index}.selectedOptionId`);
      }
    });

    if (hasErrors) {
      toast.error('Please answer all required form-items');
      return;
    }

    try {
      const parsedData = ZEvaluationFormSchema.parse(methods.getValues());
      mutateAutosaveResponse({ ...parsedData, status: 'COMPLETED' });
      toast.success('Form submitted successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          // Handle Zod validation errors
          // @ts-expect-error
          methods.setError(err.path.join('.'), {
            type: 'validation',
            message: err.message,
          });
        });
        toast.error('Validation Error: Please check your answers');
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  // FIXME this doesn't always work as intended
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (name?.startsWith('answers.') && type === 'change') {
        answersRef.current = value.answers as TEvaluationForm['answers'];

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          saveForm(answersRef.current);
        }, maxDebounceTime);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, maxDebounceTime, saveForm]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isEqual(answersRef.current, methods.getValues('answers'))) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [methods]);

  return { form, response, methods, submitForm };
}
