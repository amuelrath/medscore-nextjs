'use client'
import { InfoIcon, MicroscopeIcon } from "lucide-react";
import * as React from "react";
import EasyTooltip from "@/components/ui/easy-tooltip";
import { useAtomValue } from "jotai";
import { selectedAssessmentIdAtom } from "@/store/form-atoms";

export function GenerateAssessmentReportButton() {
  const selectedAssessmentId = useAtomValue(selectedAssessmentIdAtom)


  return (
    <button disabled={!selectedAssessmentId}  className="group flex h-7 w-full disabled:opacity-30 disabled:pointer-events-none flex-row items-center justify-between rounded-md border border-neutral-300 bg-primary/5  px-4 font-medium text-neutral-600 transition-colors hover:border-neutral-600">
      <div className="flex items-center space-x-2">
        <p className="truncate text-sm text-neutral-500">Generate Report</p>
        <EasyTooltip position="bottom" tooltipContent={<TooltipContent />}>
          <InfoIcon size={12} className="opacity-50 hover:opacity-100" />
        </EasyTooltip>
      </div>
      <MicroscopeIcon className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

const TooltipContent = () => {
  return (
    <div className="flex flex-col">
      <h6 className="font-semibold underline">Reports</h6>
      <p className="font-light">
        Generate a{" "}
        <strong className="font-medium"> comprehensive summary</strong> covering
        the aggregate results of this assessment. Pinpoint{" "}
        <strong className="font-medium">strengths</strong> and
        <strong className="font-medium"> weaknesses</strong>.
      </p>
    </div>
  );
};
