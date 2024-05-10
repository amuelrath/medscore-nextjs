"use client";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import AdministerDialog from "@/components/(admin)/forms/dialogs/administer-form-dialog";
import { AnalysisButton } from "@/components/(admin)/forms/responses/analysis-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedFormVersion } from "@/providers/selected-form-version-provider";
import { trpc } from "@/app/_trpc/client";
import { useFormValues } from "@/providers/form-values-provider";
import { TFormVersion } from "@/db/types";
import { formatDate } from "@/lib/formatDate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { ResponseCards } from "@/components/(admin)/forms/responses/response-cards";
import { useSelectedResponseId } from "@/providers/selected-response-id-provider";

export function FormResponsesSidebar() {
  const { form } = useFormValues();
  const { setSelectedResponseId } = useSelectedResponseId();
  const { formVersion, setFormVersion } = useSelectedFormVersion();
  const allVersions = trpc.forms.versions.useSuspenseQuery({
    formId: form.id,
  })[1].data;

  useEffect(() => {
    setSelectedResponseId(null);
  }, [formVersion]);

  const handleVersionSelect = (versionId: string) => {
    const selectedVersion = allVersions.find((v) => v.id === versionId);
    selectedVersion &&
      setFormVersion(selectedVersion as unknown as TFormVersion);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-1/4 space-y-2 border-r bg-background px-2 pb-2 pt-28 drop-shadow-sm",
      )}
    >
      <div className={cn("flex justify-around pt-4")}>
        <AdministerDialog />
        <AnalysisButton />
      </div>
      <div className={cn("space-y-2 rounded-md px-2 pt-2")}>
        <Select onValueChange={(val) => handleVersionSelect(val)}>
          <SelectTrigger>
            <SelectValue placeholder={"Select an Administration Date"} />
          </SelectTrigger>
          <SelectContent>
            {allVersions ? (
              allVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <div className={cn("flex flex-row space-x-4")}>
                    <span className={cn("")}>{formatDate(v.createdAt)}</span>
                    <span className={cn("font-bold")}>
                      {`${v.responses.length}`}
                      <span> Responses</span>
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <p>This Evaluation has not yet been administered.</p>
            )}
          </SelectContent>
        </Select>
        <ScrollArea className={cn("h-72 w-full scroll-p-4")}>
          <ScrollAreaScrollbar />
          <div className={cn("p-4")}>
            <ResponseCards
              formVersion={formVersion as unknown as TFormVersion}
            />
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
