"use client";

import { DeleteFormDialogTrigger } from "@/components/(admin)/forms/home/delete-evaluation-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/helpers/utils";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { QueryClient } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import {
  ClipboardIcon,
  ClockIcon,
  EditIcon,
  EyeIcon,
  FileQuestionIcon,
  GraduationCapIcon,
  TestTubeIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";

export const formTypeIcon = {
  OSCE: ClipboardIcon,
  SURVEY: FileQuestionIcon,
  DIRECT_OBSERVATION: EyeIcon,
  EVALUATION: TestTubeIcon,
};

export function FormCard({ form }: { form: FormLiteResult }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  const handleClick = () => router.push(`/forms/${form.id}`);
  const handleHover = () =>
    queryClient.fetchQuery({
      queryKey: ["form", form.id],
      queryFn: () =>
        getFormById({
          formId: form.id,
          userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
        }),
    });

  return (
    <Card
      className={cn(
        "group flex flex-shrink-0 items-center justify-between p-4 transition",
        "hover:drop-shadow-sm",
      )}
    >
      <div className="flex items-center space-x-2">
        <span className="mr-4 flex h-10 opacity-40 w-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral-500 p-2.5">
          {(() => {
            const Icon = formTypeIcon[form.type];
            return <Icon size={18} />;
          })()}
        </span>

        <div className="flex min-w-0 flex-col">
          <p
            onMouseEnter={handleHover}
            onClick={handleClick}
            className=" cursor-pointer text-lg font-semibold hover:text-accent-secondary/80 transition-colors"
          >
            {form.title}
          </p>
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center space-x-1.5">
              <GraduationCapIcon size={14} />
              <span className="hover:underline">{form.programs?.name}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1.5">
              <ClockIcon size={14} />
              <span>
                {formatDistance(new Date(form.lastOpenedAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-4 flex space-x-1">
        <Button
          onMouseEnter={handleHover}
          onClick={handleClick}
          variant="ghost"
          size="sm"
          className="opacity-0 text-neutral-700 transition-opacity group-hover:opacity-100"
        >
          <EditIcon size={16} />
        </Button>
        <DeleteFormDialogTrigger form={form}>
          <Button
            variant="hide"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <TrashIcon size={16} className="text-destructive" />
          </Button>
        </DeleteFormDialogTrigger>
      </div>
    </Card>
  );
}
