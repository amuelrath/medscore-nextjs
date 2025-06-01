import { QueryClient } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";

export const useFormDataFetcher = async (formId: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  const form = await queryClient.fetchQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({
        formId,
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID as string,
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["subcompetencies", formId],
    queryFn: () => getSubcompetencies({ formId }),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return { form, queryClient };
};