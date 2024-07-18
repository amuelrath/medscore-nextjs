"use client";

import * as React from "react";
import { FormCodeSelect } from "@/components/(admin)/forms/responses/form-code-select";
import { NewResultGroup } from "@/components/(admin)/forms/responses/new-result-group";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  selectedFormCodeIdAtom,
  selectedResponseIdAtom,
} from "@/store/form-atoms";
import {
  FormCodeResponsesResult,
  getAssessmentResponses,
} from "@/server/actions/responses/get-assessment-responses";
import { useState } from "react";
import { FileCheckIcon, SearchIcon } from "lucide-react";
import { getFullName } from "@/lib/helpers/getFullName";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/helpers/utils";

export function ResponseSelectSidebar({ formId }: { formId: string }) {
  return (
    <aside className="flex h-full w-[332px] flex-col space-y-6 overflow-x-hidden border-r border-neutral-300 bg-card/50 p-2 py-6">
      <div className="space-y-2">
        <FormCodeSelect formId={formId} />
        <NewResultGroup />
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
  const selectedFormCodeId = useAtomValue(selectedFormCodeIdAtom);
  const {
    data: responses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["responses", selectedFormCodeId],
    queryFn: () => getAssessmentResponses(selectedFormCodeId!),
    enabled: !!selectedFormCodeId,
  });

  if (isLoading)
    return (
      <>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full opacity-90" />
        <Skeleton className="h-8 w-full opacity-75" />
        <Skeleton className="h-8 w-full opacity-60" />
        <Skeleton className="h-8 w-full opacity-50" />
        <Skeleton className="h-8 w-full opacity-25" />
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
        .filter(r => r.duration) // hack way to make sure 'unsubmitted' responses are not included
        .filter((r) =>
          getFullName(r.evaluatee || {})
            .toLowerCase()
            .includes(search),
        )
        .map((r) => (
          <ResponseCard key={r.id} response={r} />
        ))}
    </div>
  );
}

interface ResponseCardProps {
  response: FormCodeResponsesResult[0];
}

function ResponseCard({ response }: ResponseCardProps) {
  const [selectedResponseId, setSelectedResponseId] = useAtom(
    selectedResponseIdAtom,
  );
  const handleSelectResponse = () => {
    setSelectedResponseId(response.id);
  };

  return (
    <div
      onClick={handleSelectResponse}
      className={cn(
        "flex flex-row items-center space-x-2 rounded-md border px-2 py-1.5 transition-colors",
        selectedResponseId === response.id
          ? "border-neutral-300  bg-primary/10"
          : "border-transparent hover:bg-primary/10",
      )}
    >
      <FileCheckIcon
        strokeWidth={2}
        className="size-4 opacity-50 transition-opacity "
      />
      <p className="text-sm text-neutral-700 ">
        {getFullName(response.evaluatee || {})}
      </p>
    </div>
  );
}
