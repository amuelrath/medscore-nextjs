"use client";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { SelectedProvider } from "@/providers/selected-values-provider";
import { FormResponsesSidebar } from "@/components/(admin)/forms/navs/form-responses-sidebar";
import { ResponseEditor } from "@/components/(admin)/forms/responses/response-editor";


export default function Responses() {
  return (
    <div className={cn("no-scrollbar mt-6")}>
        <SelectedProvider>
          <Suspense fallback={<Loading />}>
            <FormResponsesSidebar />
            <div className={cn("-mt-3 ml-[25.5%]")}>
              <div className={cn("mt-20 h-[570px]")}>
                <ResponseEditor />
              </div>
            </div>
          </Suspense>
        </SelectedProvider>
    </div>
  );
}
