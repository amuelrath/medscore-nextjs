import { User } from "@/db/schema";
import { cn } from "@/lib/utils";
import { TEvaluationForm } from "@/db/types";

export default function EvaluationFormNav({
  form,
  evaluatee,
}: {
  form: TEvaluationForm;
  evaluatee: User;
}) {
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
