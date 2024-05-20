"use client";
import { cn } from "@/lib/utils";
import { ResponseEditor } from "@/components/(admin)/forms/responses/response-editor";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { FormResponsesSidebar } from "@/components/(admin)/forms/navs/form-responses-sidebar";
import { AllFormVersionsProvider } from "@/providers/all-form-versions-provider";
import { SelectedProvider } from "@/providers/selected-values-provider";

export default function Responses() {
  return (
    <div className={cn("no-scrollbar mt-6")}>
      <AllFormVersionsProvider>
        <SelectedProvider>
          <FormResponsesSidebar />
          <div className={cn("-mt-3 ml-[25.5%]")}>
            <h3 className={cn("text-2xl font-bold tracking-wide")}>Details</h3>
            <div className={cn("mt-8 h-[570px]")}>
              <Suspense fallback={<Loading />}>
                <ResponseEditor />
              </Suspense>
            </div>
          </div>
        </SelectedProvider>
      </AllFormVersionsProvider>
    </div>
  );
}
