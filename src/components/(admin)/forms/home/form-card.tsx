"use client";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/helpers/utils";
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
import { getFormById } from "@/server/actions/forms/get-form-by-id";

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
        "group flex flex-col h-28 space-y-1 rounded-xl border border-neutral-300 bg-card p-4 shadow-sm transition-all hover:shadow-md",
      )}
    >
        <div className="flex flex-row items-start justify-between">
          <p
            onMouseEnter={() => handleHover(form.id)}
            onClick={handleClick}
            className={cn(
              "cursor-pointer text-md truncate font-semibold text-neutral-800 transition-colors hover:text-accent",
            )}
          >
            {form.title}
          </p>
          <div className="flex space-x-1">
            <Button
              onMouseEnter={() => handleHover(form.id)}
              onClick={handleClick}
              variant="hide"
              size="xs"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <EditIcon size={16} className="text-neutral-700" />
            </Button>
            <DeleteFormDialogTrigger form={form}>
              <Button
                variant="hide"
                size="xs"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <TrashIcon size={16} className="text-destructive" />
              </Button>
            </DeleteFormDialogTrigger>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-500">
          <div className="flex items-center space-x-1">
            <GraduationCapIcon size={12} />
            <span className="hover:underline">{form.programs.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HistoryIcon size={12} />
            <span>{`${formatDistance(new Date(), form.lastOpenedAt)} ago`}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 pt-2 text-xs text-neutral-600">
          <TagIcon size={10} />
          <FormTags tags={form.tags} formId={form.id} />
        </div>
    </div>
  );
}
