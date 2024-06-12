"use client";
import { cn } from "@/lib/utils";
import AdministerDialog from "@/components/(admin)/forms/dialogs/administer-form-dialog";
import { AnalysisButton } from "@/components/(admin)/forms/responses/analysis-button";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import {  useFormContext } from "react-hook-form";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import SaveFormButton from "@/components/(admin)/forms/editor/save-form-button";
import { Input } from "@/components/ui/input";

export default function FormEditorNav() {
  const methods = useFormContext<FormResult>();
  return (
    <div className={cn("fixed top-[57px] h-16 z-40 w-full")}>
      <nav className="no-scrollbar  flex flex-row items-center justify-between overflow-y-hidden border-b bg-background p-2 px-4 drop-shadow-sm">
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Input
            className={cn("text-xl font-semibold")}
            defaultValue={methods.getValues().title}
            {...methods.register("title")}
          />
          <DirectionAwareTabs />
          <SaveFormButton />
        </div>
        <div className={cn("fixed right-2 top-[10px]")}>
          <div className={cn("flex flex-row space-x-2")}>
            <AdministerDialog />
            <AnalysisButton />
          </div>
        </div>
      </nav>
    </div>
  );
}
