"use client";
import React from "react";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/helpers/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  formTypeColors,
  formTypeContent,
} from "@/components/(admin)/forms/home/create-form-dialog";
import EasyTooltip from "@/components/ui/easy-tooltip";
import { TFormType } from "@/db/schema";

const formTypeTooltipContent = {
  OSCE: "OSCE",
  SURVEY: "Survey",
  DIRECT_OBSERVATION: "Direct Observation",
  QUIZ: "Quiz",
};

export function FormCard({ form }: { form: FormLiteResult }) {
  const router = useRouter();
  const queryClient = new QueryClient();

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
          border: "border-r-accent-secondary/50",
          hover: "hover:text-accent-secondary",
        };
      case "SURVEY":
        return {
          border: "border-r-accent/50",
          hover: "hover:text-accent",
        };
      case "QUIZ":
        return {
          border: "border-r-lavender/50",
          hover: "hover:text-lavender",
        };
      case "DIRECT_OBSERVATION":
        return {
          border: "border-r-primary/50",
          hover: "hover:text-primary",
        };
      default:
        return {
          border: "",
          hover: "",
        };
    }
  };

  const typeClasses = getTypeClasses(form.type);

  return (
    <div
      className={cn(
        "group flex items-center rounded-lg border border-neutral-200 bg-white p-4 shadow-sm duration-200",
        "hover:border-neutral-300 hover:shadow-md",
        "border-r-4",
        typeClasses.border
      )}
    >
      <EasyTooltip
        asChild={false}
        tooltipContent={formTypeTooltipContent[form.type]}
      >
        <Badge
          variant="hide"
          className={cn(
            "mr-4 flex h-10 w-10 shrink-0 items-center justify-center",
            formTypeColors[form.type].bg,
            formTypeColors[form.type].foreground
          )}
        >
          {(() => {
            const Content = formTypeContent[form.type];
            return <Content size={18} />;
          })()}
        </Badge>
      </EasyTooltip>

      <div className="flex flex-col flex-grow min-w-0">
        <p
          onMouseEnter={handleHover}
          onClick={handleClick}
          className={cn(
            "line-clamp-2 cursor-pointer text-lg font-semibold transition-colors mb-2",
            typeClasses.hover
          )}
        >
          {form.title}
        </p>
        <div className="flex items-center space-x-4 text-sm text-neutral-500">
          <div className="flex items-center space-x-1.5">
            <GraduationCapIcon size={14} />
            <span className="hover:underline">{form.programs.name}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-1.5">
            <ClockIcon size={14} />
            <span>{formatDistance(new Date(form.lastOpenedAt), new Date(), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 ml-4">
        <Button
          onMouseEnter={handleHover}
          onClick={handleClick}
          variant="ghost"
          size="sm"
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <EditIcon size={16}/>
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