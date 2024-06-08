import ResponsesSection from "@/components/(admin)/forms/responses";
import { QueryClient } from "@tanstack/react-query";
import { getAllVersions } from "@/server/actions/forms/get-all-versions";

// TODO - ISR
export default async function ResponsesPage({ params}: { params: { formId: string }}) {
  // prefetch form versions and responses
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })
    // all versions given a form id (get from params)
  await queryClient.prefetchQuery({
    queryKey: ["all-versions", params.formId],
    queryFn: () => getAllVersions({ formId: params.formId }),
  })

  return <ResponsesSection />;
}
