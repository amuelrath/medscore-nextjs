"use client";
import React from "react";
import { m } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSelectedResponse from "@/hooks/queries/use-get-selected-response";
import { useFormResultInEditor } from "@/hooks/queries/use-form-result-in-editor";
import { getFullName } from "@/lib/helpers/getFullName";
import LetterPullup from "@/components/ui/letter-pull-up";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import {
  selectedAssessmentIdAtom,
  selectedResponseIdAtom,
} from "@/store/form-atoms";
import { useAtomValue } from "jotai/index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";
import { ResponseDropdown } from "@/components/(admin)/forms/responses/dropdowns/response-dropdown";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export function ResponseInformationCard() {
  const selectedAssessmentId = useAtomValue(selectedAssessmentIdAtom);

  const { formResult, isLoading: isFormResultLoading } =
    useFormResultInEditor();
  const { assessments, isLoading: isAssessmentsLoading } =
    useGetFormAssessments();
  const { response, isLoading: isResponseLoading } = useGetSelectedResponse();

  const assessment = assessments.find((a) => a.id === selectedAssessmentId);

  const evaluateeName = getFullName(
    assessment?.evaluatees.find((e) => e.user.id === response?.evaluateeId)
      ?.user,
  );

  const evaluatorName = getFullName(
    formResult?.programs.users.find((u) => u.user.id === response?.creatorId)
      ?.user,
  );

  if (isFormResultLoading || isAssessmentsLoading || isResponseLoading)
    return null;
  if (!response || !assessment) return null;

  return (
    <Card className="flex w-full flex-col space-y-4 rounded-md p-4">
      <div  className="flex flex-col space-y-2">
        <ResponseProfile key={response.id} role="Evaluatee" name={evaluateeName} />
        <div className="mt-2 flex flex-row items-center justify-between space-x-2">
          <Button
            size="xs"
            variant="accent"
            className={cn(
              "w-full text-teal-950 disabled:pointer-events-none disabled:opacity-30",
            )}
          >
            Request Self Evaluation
          </Button>
          <ResponseDropdown>
            <button className="group flex h-6 w-6 flex-row items-center justify-center rounded-md border border-neutral-300 bg-primary/5 font-medium  text-neutral-600 transition-colors hover:border-neutral-600 disabled:pointer-events-none disabled:opacity-30">
              <DotsHorizontalIcon className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
            </button>
          </ResponseDropdown>
        </div>
        <hr/>
      </div>
        <ResponseProfile  key={response.id} role="Evaluator" name={evaluatorName} />
    </Card>
  );
}

function ResponseProfile({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <span className="size-6 rounded-full bg-primary/5" />
      <div className="flex flex-col">
        <p className="text-2xs text-neutral-500">{role}</p>
        <LetterPullup words={name} size="sm" delay={0.01} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center space-y-4"
    >
      <Card className="flex w-full flex-col rounded-md p-4">
        <Skeleton className="my-1 h-4 w-3/4" />
        <Skeleton className="mb-1 h-3 w-1/2" />
        <Skeleton className="mb-2 h-[1px] w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-6" />
        </div>
      </Card>

      <Card className="w-full p-4">
        <div className="flex flex-col items-center space-y-1">
          <Skeleton className="mb-1 h-4 w-40" />
          <div className="flex flex-row items-center justify-center space-x-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
        <Skeleton className="mb-[0.8em] mt-4 h-28 w-full" />
      </Card>

      <Card className="w-full p-4">
        <div className="mb-2 flex items-center justify-center">
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-44 w-full scale-75 rounded-full" />
      </Card>
    </m.div>
  );
}

function NoData() {
  return (
    <div className="flex h-[267px] w-full items-center justify-center rounded-md border border-neutral-300">
      No Response Selected
    </div>
  );
}
