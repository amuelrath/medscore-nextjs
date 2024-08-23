import { cancelAssessment } from '@/server/actions/assessments/cancel-assessment';
import { deleteAssessment } from '@/server/actions/assessments/delete-assessment';
import { AssessmentsWithRequestsResult } from '@/server/actions/assessments/get-assessments-with-requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { renameAssessment } from '@/server/actions/assessments/name';

export function useAssessmentRequestActions({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const now = new Date();
  const queryClient = useQueryClient();

  // Change the assessment.expiresAt property to the current time
  const { mutate: mutateCancelAssessment } = useMutation({
    mutationFn: () => cancelAssessment({ assessmentId }),
    onMutate: () => {
      // optimistically update the cancellation
      queryClient.setQueryData(
        ['assessments'],
        (oldData: AssessmentsWithRequestsResult | undefined) => oldData?.map((a) =>
            a.id === assessmentId
              ? {
                  ...a,
                  expiresAt: now,
                }
              : a,
          ),
      );
    },
    onError: () => toast.error('Something went wrong.'),
    onSuccess: () => {},
  });

  // Completely deletes the assessment and all related responses
  const { mutate: mutateDeleteAssessment } = useMutation({
    mutationFn: () => deleteAssessment({ assessmentId }),
    onMutate: () => {
      queryClient.setQueryData(
        ['assessments'],
        (oldData: AssessmentsWithRequestsResult | undefined) => oldData?.filter((a) => a.id !== assessmentId),
      );
    },
    onError: () => toast.error('Something went wrong.'),
    onSuccess: () => {},
  });

  const { mutate: mutateRenameAssessment } = useMutation({
    mutationFn: renameAssessment,
    onMutate: (data) => {
      queryClient.setQueryData(
        ['assessments'],
        (oldData: AssessmentsWithRequestsResult | undefined) => oldData?.map((a) =>
          a.id === assessmentId
            ? {
              ...a,
              title: data.title,
            }
            : a,
        ),
      );
    }
  })

  return { mutateCancelAssessment, mutateDeleteAssessment, mutateRenameAssessment }
}
