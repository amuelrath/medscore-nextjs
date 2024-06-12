import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import FormsHome from "@/components/(admin)/forms/home";
import { cn } from "@/lib/utils";
import { FormHomeNav } from "@/components/(admin)/forms/navs/form-home-nav";

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
      <div className="lg:px-8 xs:px-4 h-full">
        <FormsHome />
      </div>
    </HydrationBoundary>
  );
}
