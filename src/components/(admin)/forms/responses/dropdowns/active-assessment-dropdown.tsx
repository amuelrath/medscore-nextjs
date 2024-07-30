import React, { ReactNode, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai/index";
import { manageDialogOpenAtom, manageDialogSelectedAssessmentIdAtom, selectedResponseIdAtom } from "@/store/form-atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EditIcon} from "lucide-react";

export function ActiveAssessmentDropdown({ children, assessmentId }: { children: ReactNode, assessmentId: string | undefined}) {
  const setManageDialogOpen = useSetAtom(manageDialogOpenAtom)
  const setManageDialogSelectedAssessmentId = useSetAtom(manageDialogSelectedAssessmentIdAtom)
  const handleClick = () => {
    setManageDialogOpen(true);
    setManageDialogSelectedAssessmentId(assessmentId)
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="mr-8">
        <DropdownMenuItem className="space-x-2" onClick={handleClick} >
          <EditIcon size={14} className="opacity-50" />
          <p>Details</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

