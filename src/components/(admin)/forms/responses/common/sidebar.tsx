"use client";
import { AssessmentSelect } from "@/components/(admin)/forms/responses/common/assessment-select";
import { GenerateAssessmentReportButton } from "@/components/(admin)/forms/responses/common/generate-assessment-report-button";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { m } from 'framer-motion'
import {
  selectedAssessmentIdAtom,
  selectedResponseIdAtom,
} from "@/store/form-atoms";
import {
  AssessmentResponsesResult,
  getAssessmentResponsesWithUsers,
} from "@/server/actions/responses/get-assessment-responses-with-users";
import { useState } from "react";
import { FileCheckIcon, SearchIcon } from "lucide-react";
import { getFullName } from "@/lib/helpers/getFullName";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/helpers/utils";
import { AssessmentDropdown } from "@/components/(admin)/forms/responses/dropdowns/assessment-dropdown";
import { ResponseDropdown } from "@/components/(admin)/forms/responses/dropdowns/response-dropdown";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export function Sidebar() {
  return (
    <aside className="flex h-full min-w-[265px] flex-col space-y-6 border-r border-neutral-300 bg-card/50 p-2 pb-6">
      <div className="space-y-2">
        <div className="flex flex-row items-center space-x-2">
          <AssessmentSelect />
          <AssessmentDropdown />
        </div>
        <GenerateAssessmentReportButton />
      </div>
      <div className="h-full space-y-2">
        <ResponseCardList />
      </div>
    </aside>
  );
}

function ResponseCardList() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // get responses relevant to the selectedFormCodeId
  const selectedFormCodeId = useAtomValue(selectedAssessmentIdAtom);
  const {
    data: responses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["responses", selectedFormCodeId],
    queryFn: () => getAssessmentResponsesWithUsers(selectedFormCodeId!),
    enabled: !!selectedFormCodeId,
  });

  if (isLoading)
    return (
      <>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </>
    );

  if (isError) return <>Error!</>;

  if (!responses) return <>No Responses</>;

  return (
    <div className="space-y-2">
      <div className="relative border-b">
        <SearchIcon className="absolute left-2 top-1.5 size-3 opacity-50" />
        <Input
          size="xs"
          placeholder="Search results..."
          className={cn("bg-inherit pl-6 font-light")}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {responses
        .filter((r) => r.assessmentId === selectedFormCodeId)
        .filter((r) => r.duration) // hack way to make sure 'unsubmitted' responses are not included
        .filter((r) => getFullName(r.evaluatee).toLowerCase().includes(search))
        .map((r) => (
          <ResponseCard key={r.id} response={r} />
        ))}
    </div>
  );
}

interface ResponseCardProps {
  response: AssessmentResponsesResult[0];
}

function ResponseCard({ response }: ResponseCardProps) {
  const [selectedResponseId, setSelectedResponseId] = useAtom(
    selectedResponseIdAtom,
  );
  const handleSelectResponse = () => {
    setSelectedResponseId(response.id);
  };

  const isSelected =  selectedResponseId === response.id

  return (
    <div
      onMouseDown={handleSelectResponse}
      className={cn(
        "flex cursor-pointer select-none flex-row items-center justify-between space-x-2 rounded-md border px-2 py-1.5 transition-colors",
        isSelected
          ? " border-transparent  bg-primary/5 "
          : " hover:border-neutral-300",
      )}
    >
      <div className="flex flex-row space-x-2 items-center">
      <FileCheckIcon
        strokeWidth={2}
        className="size-4 opacity-50 transition-opacity "
      />
      <p className="text-sm text-neutral-700 ">
        {getFullName(response.evaluatee)}
      </p>
      </div>
      {isSelected && (
      <ResponseDropdown>
        <m.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        >
        <DotsHorizontalIcon className={cn("opacity-50 hover:opacity-100 transition-opacity")} />
        </m.div>
      </ResponseDropdown>
      )}
    </div>
  );
}
