'use client';

import {
  AssessmentEditorDialog,
  TAssessmentEditorFormSchema,
} from '@/components/(admin)/forms/home/assessment-editor-dialog';
import { IncomingRequests } from '@/components/(admin)/forms/home/incoming-requests';
import { OutgoingRequests } from '@/components/(admin)/forms/home/outgoing-requests';
import { cn } from '@/lib/helpers/utils';
import { createAssessmentWithRequests } from '@/server/actions/assessments/create-assessment-with-requests';
import { FormsLiteResult } from '@/server/actions/forms/get-all-forms-lite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RequestsContentProps {
  initialForms: FormsLiteResult;
}

export function RequestsContent({ initialForms }: RequestsContentProps) {
  const { data: forms } = useQuery({
    queryKey: ['forms'],
    queryFn: () => Promise.resolve(initialForms),
    initialData: initialForms,
  });

  const queryClient = useQueryClient();
  const { mutate: createAssessmentMutation } = useMutation({
    mutationFn: createAssessmentWithRequests,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const submitFn = (data: TAssessmentEditorFormSchema) => {
    createAssessmentMutation({
      ...data,
    });
  };

  return (
    <main className="flex-grow h-full flex bg-primary/5 flex-col outline">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b bg-card border-border p-1 pl-4 pr-2">
        <span className="flex items-center space-x-2">
          <h3 className={cn('text-2xl font-bold text-neutral-700')}>
            Requests
          </h3>
        </span>
        <div className="space-x-4 flex flex-row items-center">
          <AssessmentEditorDialog forms={forms} submitFn={submitFn} />
        </div>
      </div>
      <div className="grid grid-cols-4 flex-grow gap-4 p-4 grid-rows-1">
        <OutgoingRequests />
        <IncomingRequests />
      </div>
    </main>
  );
}
