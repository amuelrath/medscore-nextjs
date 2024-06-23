import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import FormsHome from "@/components/(admin)/forms/home";

export default async function FormsPage() {
  // prefetch forms (just the id, title, program)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["forms", "lite"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="fixed right-60 top-44 -z-10">

      </div>
      <div className="no-scrollbar relative h-full xs:px-4 lg:px-8">
        <FormsHome />
      </div>
    </HydrationBoundary>
  );
}
