"use client";

import * as React from "react";
import { FormCodeSelect } from "@/components/(admin)/forms/responses/form-code-select";
import { NewResultGroup } from "@/components/(admin)/forms/responses/new-result-group";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { selectedFormCodeIdAtom } from "@/store/form-atoms";
import {
  FormCodeResponsesResult,
  getFormCodeResponses,
} from "@/server/actions/responses/get-form-code-responses";
import { useState } from "react";
import {  FileCheckIcon, SearchIcon } from "lucide-react";
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
    queryFn: () => getFormCodeResponses(selectedFormCodeId!),
    enabled: !!selectedFormCodeId,
  });

  if (isLoading) return (<>
    <Skeleton className="w-full h-8" />
    <Skeleton className="w-full h-8 opacity-90" />
    <Skeleton className="w-full h-8 opacity-75" />
    <Skeleton className="w-full h-8 opacity-60" />
    <Skeleton className="w-full h-8 opacity-50" />
    <Skeleton className="w-full h-8 opacity-25" />
  </>);

  if (isError) return <>Error!</>;

  if (!responses) return <>No Responses</>

  return (
    <div className="space-y-2">
      <div className="relative border-b">
        <SearchIcon className="absolute left-2 top-1.5 size-3 opacity-50" />
        <Input
          size="xs"
          placeholder="Search results..."
          className={cn("pl-6 bg-inherit font-light")}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {
        responses
          .filter((r) => r.formCodeId === selectedFormCodeId)
          .filter((r) =>
            getFullName(r.evaluatee || {}).toLowerCase().includes(search),
          )
          .map((r) => <ResponseCard key={r.id} response={r} />)
      }
    </div>
  );
}

interface ResponseCardProps {
  response: FormCodeResponsesResult[0];
}

function ResponseCard({ response }: ResponseCardProps) {
  return (
    <div className="flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 transition-colors hover:bg-blue-800/5">
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
