"use client";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/app/_trpc/client";
import { useFormValues } from "@/providers/form-values-provider";
import { formatDate } from "@/lib/formatDate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { ResponseCards } from "@/components/(admin)/forms/responses/response-cards";
import { ResponseOverviewCard } from "@/components/(admin)/forms/responses/response-overview-card";
import { useRouter, useSearchParams } from "next/navigation";
import { TFormVersion } from "@/db/types";
import { getPercentChangeOverall } from "@/lib/responses/getPercentChange";
import { useFormVersions } from "@/hooks/useFormVersions";

export function FormResponsesSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { allVersions, isLoading, selectedVersionId } = useFormVersions();

  useEffect(() => {
    if (selectedVersionId) {
      setSelectedVersion(selectedVersionId);
    }
  }, [selectedVersionId]);

  const handleVersionSelect = (versionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("versionId", versionId);
    setSelectedVersion(versionId);
    params.delete("responseId");
    router.push(`?${params.toString()}`);
  };

  const selectedFormVersion = allVersions?.find(
    (v) => v.id === selectedVersion,
  ) as TFormVersion | undefined;

  return (
    <aside
      className={cn(
        "fixed left-0 top-4 z-40 h-full w-1/4 border-r bg-background px-2 pb-2 pt-[108px] drop-shadow-sm",
      )}
    >
      <div className={cn("flex flex-col space-y-8")} >

      <ResponseOverviewCard />
      <div className={cn("space-y-2 pt-6 rounded-md px-2")}>
        <Select
          key={`select-${selectedVersion}`}
          onValueChange={handleVersionSelect}
          value={selectedVersion || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an Administration Date" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectValue placeholder={"Loading..."} />
            ) : allVersions?.length ? (
              allVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <div
                    className={cn(
                      "flex w-72 flex-row items-center justify-between",
                    )}
                  >
                    <span className={cn("")}>{formatDate(v.createdAt)}</span>
                    <span className={cn("font-bold")}>
                      {`${v.responses.length}`}
                      <span> Responses</span>
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectValue
                placeholder={"This evaluation hasn't been administered yet! "}
              />
            )}
          </SelectContent>
        </Select>
        <ScrollArea className={cn("h-[293px] w-full scroll-p-4")}>
          <ScrollAreaScrollbar />
          <div className={cn("px-4")}>
            {selectedFormVersion ? (
              <ResponseCards formVersion={selectedFormVersion} />
            ) : (
              <></>
            )}
          </div>
        </ScrollArea>
      </div>
      </div>
    </aside>
  );
}
