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
} from "lucide-react";
import { DeleteFormDialogTrigger } from "@/components/(admin)/forms/home/delete-evaluation-dialog";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { Separator } from "@/components/ui/separator";
import { formTypeColors } from "@/components/(admin)/forms/home/create-form-dialog";
import { TFormType } from "@/db/schema";
import ASSIGNMENT_ICON from "public/icons/assessment-accent-secondary.json";
import QUESTION_MARK_ICON from "public/icons/help-accent.json";
import EYE_ICON from "public/icons/eye-primary.json";
import SCIENCE_ICON from "public/icons/science-lavender.json";
import Lottie from "lottie-react";

const formTypeIcon = {
  OSCE: ASSIGNMENT_ICON,
  SURVEY: QUESTION_MARK_ICON,
  DIRECT_OBSERVATION: EYE_ICON,
  QUIZ: SCIENCE_ICON,
};

export function FormCard({ form }: { form: FormLiteResult }) {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => router.push(`/forms/${form.id}`);
  const handleHover = async () => {
    await queryClient.fetchQuery({
      queryKey: ["form", form.id],
      queryFn: () =>
        getFormById({
          formId: form.id,
          userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
        }),
    });
  };

  const getTypeClasses = (type: TFormType) => {
    switch (type) {
      case "OSCE":
        return {
          hover: "hover:border-r-accent-secondary/50",
          link: "hover:text-accent-secondary ",
        };
      case "SURVEY":
        return {
          hover: "hover:text-accent hover:border-r-accent/50",
          link: "hover:text-accent",
        };
      case "QUIZ":
        return {
          hover: "hover:border-r-lavender/50",
          link: "hover:text-lavender",
        };
      case "DIRECT_OBSERVATION":
        return {
          hover: "hover:border-r-primary/50",
          link: "hover:text-primary",
        };
      default:
        return {
          border: "",
          hover: "",
          link: "",
        };
    }
  };

  const typeClasses = getTypeClasses(form.type);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <div
      className={cn(
        "group flex items-center flex-row justify-between rounded-lg border bg-white p-4 shadow-sm duration-200",
        `border-neutral-300 hover:shadow-md`,
        "border-r-4",
        typeClasses.hover,
      )}
    >
      <div className="flex flex-row items-center space-x-2" >
        <span
          className={cn(
            "mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 p-2.5",
            formTypeColors[form.type].bg,
            formTypeColors[form.type].foreground,
          )}
        >
          <Lottie autoplay={false} animationData={formTypeIcon[form.type]} />
        </span>

        <div className="flex min-w-0 flex-col">
          <p
            onMouseEnter={handleHover}
            onClick={handleClick}
            className={cn(
              "mb-2 cursor-pointer text-lg font-semibold transition-colors",
              typeClasses.link,
            )}
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
    </div>
  );
}
