"use client";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { SelectedProvider } from "@/providers/selected-values-provider";
import { FormResponsesSidebar } from "@/components/(admin)/forms/navs/form-responses-sidebar";
import { ResponseEditor } from "@/components/(admin)/forms/responses/response-editor";

export default function Responses() {
  return (
    <div className={cn("no-scrollbar mt-[57px] h-[83vh]")}>
      <SelectedProvider>
        <Suspense fallback={<Loading />}>
          <FormResponsesSidebar />
          <div className={cn("ml-[25.5%] h-full")}>
            <ResponseEditor />
          </div>
        </Suspense>
      </SelectedProvider>
    </div>
  );
}
