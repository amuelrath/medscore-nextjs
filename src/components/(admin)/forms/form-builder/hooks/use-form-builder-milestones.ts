import { getSubcompetencies } from '@/server/actions/forms/get-subcompetencies';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function useFormBuilderMilestones() {
  // First we should get the form's id from search params
  const params = useParams();
  const formId = params.formId.toString();

  // Get the subcompetency data
  return useQuery({
    queryKey: ['milestones', formId], // TODO use specialty id instead of formId
    queryFn: () => getSubcompetencies({ formId }),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
