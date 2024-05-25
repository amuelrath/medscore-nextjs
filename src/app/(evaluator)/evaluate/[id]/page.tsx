"use client";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import { TEvaluationForm } from "@/db/types";
import { User } from "@/db/schema";
import { Section } from "@/components/ui/section";
import EvaluationFormNav from "@/components/(evaluator)/navs/evaluation-form-nav";
import EvaluationForm from "@/components/(evaluator)/forms/evaluation-form";

export default function EvaluateIdPage({ params }: { params: { id: string } }) {
  // TODO Verify that the form is still active. Or that the session the form was loaded on hasn't expired.
  // TODO Add alert on attempt page refresh. If refresh, redirect to home page and erase localStorage for "evaluatee".

  const form = trpc.responses.getFormById.useQuery(
    {
      formId: params.id,
    },
    { staleTime: 1000 * 60 * 60 },
  );

  const getEvaluatee = () => {
    if (typeof window !== "undefined") {
      try {
        const evaluateeString = window.localStorage.getItem("evaluatee");
        if (evaluateeString) {
          return JSON.parse(evaluateeString) as User;
        }
      } catch (error) {
        console.error("Error parsing evaluatee from localStorage:", error);
      }
    }
    return null;
  };

  const evaluatee = getEvaluatee();
  // if (!evaluatee) throw new Error("No Evaluatee Chosen. Please try again.");
  // this ^ throws an error even if evaluatee is defined in localStorage

  if (form.isLoading) {
    return (
      <div
        className={cn(
          "mt-[25%] flex h-full w-full items-center justify-center",
        )}
      >
        <Loading />
      </div>
    );
  }

  // TODO weird type errors thrown by Date being a string
  return (
    <>
      <EvaluationFormNav
        form={form.data as unknown as TEvaluationForm}
        evaluatee={evaluatee || ({} as User)}
      />
      <Section>
        <div
          className={cn(
            "no-scrollbar flex h-full w-full flex-col space-y-4 pb-40 pt-4 sm:px-4 lg:px-32",
          )}
        >
          <EvaluationForm
            form={
              (form.data as unknown as TEvaluationForm) ||
              ({} as TEvaluationForm)
            }
          />
        </div>
      </Section>
    </>
  );
}
