import ResponsesSection from "@/components/(admin)/forms/responses";
import { QueryClient } from "@tanstack/react-query";
import { getAllVersions } from "@/server/actions/forms/get-all-versions";

// TODO - ISR
export default async function ResponsesPage({ params}: { params: { formId: string }}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })

  // prefetch form versions and responses
  await queryClient.prefetchQuery({
    queryKey: ["all-versions", params.formId],
    queryFn: () => getAllVersions({ formId: params.formId }),
  })

  return <ResponsesSection />;
}
