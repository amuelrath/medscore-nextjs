// @/components/(admin)/forms/responses/index.tsx
"use client";
import { cn } from "@/lib/utils";
import { ResponseEditor } from "@/components/(admin)/forms/responses/response-editor";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { FormResponsesSidebar } from "@/components/(admin)/forms/navs/form-responses-sidebar";

export default function Responses() {
  return (
    <div className={cn("no-scrollbar mt-6")}>
      <FormResponsesSidebar />
      <div className={cn("-mt-3 ml-[25.5%]")}>
        <h3 className={cn("font-poppins text-2xl font-bold tracking-wide")}>
          Details
        </h3>
        <div className={cn("h-[570px] mt-8")}>
          <Suspense fallback={<Loading />}>
            <ResponseEditor />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
