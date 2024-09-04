import {
  TEvaluationForm,
  transformToSchema,
  ZEvaluationFormSchema,
} from '@/components/(evaluation)/evaluation-form/schemas';
import { ZFormSettingsSchema } from '@/lib/zod/form-schema';
import {
  EvaluationFormResult,
  getEvaluationForm,
} from '@/server/actions/evaluate/get-evaluation-form';
import { saveResponse } from '@/server/actions/responses/save-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { isAfter, isBefore } from 'date-fns';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type TMode = 'readonly' | 'edit' | 'default';

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
  incrementDebounceTime = 1000,
  maxActiveTime = 15000,
}: UseEvaluationForm) {
  const {
    data: { form, response },
  } = useSuspenseQuery({
    queryKey: ['evaluation-form', responseId],
    queryFn: () => getEvaluationForm({ responseId }),
  });

  const methods = useForm<TEvaluationForm>({
    defaultValues: transformToSchema({ form, response }),
    resolver: zodResolver(ZEvaluationFormSchema),
  });

  const data = useWatch({
    control: methods.control,
    name: 'answers',
  });

  const [prev, setPrev] = useState<TEvaluationForm['answers']>(data);
  const saveQueueRef = useRef<TEvaluationForm['answers'][]>([]);
  const savingRef = useRef(false);

  const { mutate: mutateAutosaveResponse } = useMutation({
    mutationFn: saveResponse,
    onSuccess: () => {
      setPrev(data);
      savingRef.current = false;
      processQueue();
    },
    onError: (error) => {
      console.error('Error saving response:', error);
      savingRef.current = false;
      processQueue();
    },
  });

  validateResponseIsAllowed({ form, response, mode });

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

  const processQueue = useCallback(() => {
    if (saveQueueRef.current.length > 0 && !savingRef.current) {
      const nextSave = saveQueueRef.current.shift();
      if (nextSave) {
        savingRef.current = true;
        saveForm(nextSave);
      }
    }
  }, [saveForm]);

  useEffect(() => {
    if (!isEqual(prev, data)) {
      saveQueueRef.current.push(data);
      processQueue();
    }
  }, [data, prev, processQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      processQueue();
    }, maxDebounceTime);

    return () => clearInterval(interval);
  }, [maxDebounceTime, processQueue]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveQueueRef.current.length > 0) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { form, response, methods };
}

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
