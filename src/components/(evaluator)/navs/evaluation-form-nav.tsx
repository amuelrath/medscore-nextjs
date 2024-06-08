"use client";
import { User } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import Loading from "@/components/ui/loading";

export function EvaluationFormNav({ formId }: { formId: string }) {
  const { data: form, isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({
        formId: formId,
        userId: process.env.NEXT_PUBLIC_USER_ID as string,
      }),
  });

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

  // TODO Add skeleton loader
  if (isLoading) return <Loading />;
  if (!form) return <>Error loading form.</>;

  return (
    <nav
      className={cn(
        "sticky top-[57px] z-20 flex h-12 w-full space-x-4 divide-x-2 divide-solid bg-background p-2 shadow-md",
      )}
    >
      <div className={cn("flex-col justify-center")}>
        <p className={cn("text-xs font-bold tracking-wider text-gray-400")}>
          CASE
        </p>
        <p className={cn("font-regular")}>{form.title}</p>
      </div>
      <div className={cn("pl-4")}>
        <p
          className={cn(
            "flex-col justify-center text-xs font-bold tracking-wider text-gray-400",
          )}
        >
          EVALUATING
        </p>
        <p
          className={cn("font-regular")}
        >{`${evaluatee?.firstName} ${evaluatee?.lastName}`}</p>
      </div>
    </nav>
  );
}
