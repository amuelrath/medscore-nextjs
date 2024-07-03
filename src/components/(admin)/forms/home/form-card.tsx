"use client";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { QueryClient } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EditIcon,
  GraduationCapIcon,
  HistoryIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import { DeleteFormDialogTrigger } from "@/components/(admin)/forms/dialogs/delete-evaluation-dialog";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { FormTags } from "@/components/(admin)/forms/home/form-tags";

export function FormCard({ form }: { form: FormLiteResult }) {
  const router = useRouter();
  const queryClient = new QueryClient();
  const handleClick = async () => {
    router.push(`/forms/${form.id}`);
  };

  const handleHover = async (formId: string) => {
    await queryClient.fetchQuery({
      queryKey: ["form", formId],
      queryFn: () =>
        getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
    });
  };
  return (
    <div
      className={cn(
        "group mb-4 flex select-none flex-row justify-between rounded-xl border border-neutral-200 bg-card p-3 shadow-sm transition-all",
      )}
    >
      <div
        className={cn(
          "group flex w-full flex-col items-stretch justify-center ",
        )}
      >
        <div className={cn("flex w-full flex-row")}>
          <p
            onMouseEnter={() => handleHover(form.id)}
            onClick={handleClick}
            className={cn("cursor-pointer text-lg font-medium")}
          >
            {form.title}
          </p>
        </div>
        <div
          className={cn(
            "flex w-full flex-row truncate text-sm text-neutral-500 sm:space-x-2 md:space-x-4",
          )}
        >
          <p className={cn("flex flex-row items-center space-x-1 ")}>
            <GraduationCapIcon
              className={cn("text-neutral-400/90")}
              size={16}
            />
            <span className={cn("hover:underline")}>{form.programs.name}</span>
          </p>
          <p className={cn("flex flex-row items-center space-x-1")}>
            <HistoryIcon className={cn("text-neutral-400/90")} size={16} />
            <span>{`${formatDistance(new Date(), form.lastOpenedAt)} ago`}</span>
          </p>
          <div className={cn("flex flex-row items-center space-x-1")}>
            <TagIcon className={cn("text-neutral-400/90")} size={16} />
            <FormTags tags={form.tags} formId={form.id} />
          </div>
        </div>
      </div>
      <div className={cn("flex flex-row items-center space-x-2")}>
        <Button
          onMouseEnter={() => handleHover(form.id)}
          onClick={handleClick}
          variant={"foreground"}
          size={"sm"}
          className={cn("opacity-0 transition-opacity group-hover:opacity-100")}
        >
          <EditIcon />
        </Button>
        <DeleteFormDialogTrigger form={form}>
          <Button
            variant={"link"}
            size={"sm"}
            className={cn(
              "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            <TrashIcon />
          </Button>
        </DeleteFormDialogTrigger>
      </div>
    </div>
  );
}
