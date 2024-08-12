"use client";

import React, { useState, useEffect } from "react";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/helpers/utils";
import { Button } from "@/components/ui/button";
import {
  EditIcon,
  GraduationCapIcon,
  ClockIcon,
  TrashIcon,
  ClipboardIcon,
  EyeIcon,
  TestTubeIcon,
  FileQuestionIcon
} from "lucide-react";
import { DeleteFormDialogTrigger } from "@/components/(admin)/forms/home/delete-evaluation-dialog";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { Separator } from "@/components/ui/separator";
import { TFormType } from "@/db/schema";
import Lottie from "lottie-react";

import ASSIGNMENT_ICON from "public/icons/assessment-accent-secondary.json";
import QUESTION_MARK_ICON from "public/icons/help-accent.json";
import EYE_ICON from "public/icons/eye-primary.json";
import SCIENCE_ICON from "public/icons/science-lavender.json";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

export const formTypeIcon = {
  OSCE: ClipboardIcon,
  SURVEY: FileQuestionIcon,
  DIRECT_OBSERVATION: EyeIcon,
  QUIZ: TestTubeIcon,
};

const typeClasses: Record<TFormType, { hover: string }> = {
  OSCE: { hover: "border-l-accent-secondary/50" },
  SURVEY: { hover: "border-l-accent/50" },
  QUIZ: { hover: "border-l-lavender/50" },
  DIRECT_OBSERVATION: { hover: "border-l-primary/50" },
};

export function FormCard({ form }: { form: FormLiteResult }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  const handleClick = () => router.push(`/forms/${form.id}`);
  const handleHover = () => queryClient.fetchQuery({
    queryKey: ["form", form.id],
    queryFn: () => getFormById({
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
            const Icon = formTypeIcon[form.type]
            return (
              <Icon size={18} />
            )
          })()}
        </span>

        <div className="flex min-w-0 flex-col">
          <p
            onMouseEnter={handleHover}
            onClick={handleClick}
            className="mb-2 cursor-pointer text-lg font-semibold hover:text-accent-secondary/80 transition-colors"
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
                {formatDistance(new Date(form.lastOpenedAt), new Date(), { addSuffix: true })}
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