"use client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/formatDate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { useSelectedContext } from "@/providers/selected-values-provider";
import React, { useMemo } from "react";
import { ResponseOverviewCard } from "@/components/(admin)/forms/responses/response-overview-card";
import { ResponseCards } from "@/components/(admin)/forms/responses/response-cards";
import { useAllFormVersionsSuspenseQueryResult } from "@/hooks/useAllFormVersionsSuspenseQueryResult";

export function FormResponsesSidebar() {
  const { versions } = useAllFormVersionsSuspenseQueryResult();
  const { selectedVersion, setSelectedVersion } = useSelectedContext();

  const handleVersionSelect = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (!version) throw new Error("Selected version could not be located!");
    setSelectedVersion(version);
  };

  const versionOptions = useMemo(
    () =>
      versions.map((v) => (
        <SelectItem key={v.id} value={v.id}>
          <div
            className={cn("flex w-72 flex-row items-center justify-between")}
          >
            <span className={cn("")}>{formatDate(v.createdAt)}</span>
            <span className={cn("font-bold")}>
              {`${v.responses.length}`}
              <span> Responses</span>
            </span>
          </div>
        </SelectItem>
      )),
    [versions],
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-4 z-40 h-full w-1/4 border-r bg-background px-2 pb-2 pt-[108px] drop-shadow-sm",
      )}
    >
      <div className={cn("flex flex-col space-y-8")}>
        <ResponseOverviewCard />
        <div className={cn("space-y-2 rounded-md px-2 pt-6")}>
          <Select
            key={`select-${selectedVersion?.id}`}
            onValueChange={handleVersionSelect}
            value={selectedVersion?.id || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Administration Date" />
            </SelectTrigger>
            <SelectContent>
              {versions.length ? (
                versionOptions
              ) : (
                <SelectValue
                  placeholder={"This evaluation hasn't been administered yet!"}
                />
              )}
            </SelectContent>
          </Select>
          <ScrollArea className={cn("h-[293px] w-full scroll-p-4")}>
            <ScrollAreaScrollbar />
            <div className={cn("px-4")}>
              {selectedVersion && (
                <ResponseCards formVersion={selectedVersion} />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
