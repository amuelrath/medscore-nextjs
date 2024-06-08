import FormViewerSection from "@/components/(admin)/forms/viewer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllForms } from "@/server/actions/forms/get-all-forms";

export default async function FormsPage() {
  // prefetch forms
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllForms({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  // hydrate queryClient
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormViewerSection />
    </HydrationBoundary>
  );
}
