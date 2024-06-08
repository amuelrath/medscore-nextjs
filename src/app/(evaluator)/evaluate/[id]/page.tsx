import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { EvaluationFormNav } from "@/components/(evaluator)/navs/evaluation-form-nav";
import EvaluationForm from "@/components/(evaluator)/forms/evaluation-form";
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";

export default async function EvaluateIdPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO Verify that the form is still active. Or that the session the form was loaded on hasn't expired.
  // TODO Add alert on attempt page refresh. If refresh, redirect to home page and erase localStorage for "evaluatee".

  // prefetch form based on params.id
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3, // 3 minutes
      },
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ["form", params.id],
    queryFn: () =>
      getFormById({
        formId: params.id,
        userId: process.env.NEXT_PUBLIC_USER_ID as string,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EvaluationFormNav formId={params.id} />
      <Section>
        <div
          className={cn(
            "no-scrollbar flex h-full w-full flex-col space-y-4 pb-40 pt-4 sm:px-4 lg:px-32",
          )}
        >
          <EvaluationForm formId={params.id} />
        </div>
      </Section>
    </HydrationBoundary>
  );
}
