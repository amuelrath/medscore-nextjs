"use client";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { AllFormVersionsProvider } from "@/providers/all-form-versions-provider";
import { SelectedProvider } from "@/providers/selected-values-provider";
import dynamic from "next/dynamic";
const DynamicResponseEditor = dynamic(
  () =>
    import("@/components/(admin)/forms/responses/response-editor").then(
      (module) => module.ResponseEditor,
    ),
  { ssr: false, loading: () => <Loading /> },
);

const DynamicFormResponsesSidebar = dynamic(
  () =>
    import("@/components/(admin)/forms/navs/form-responses-sidebar").then(
      (module) => module.FormResponsesSidebar,
    ),
  { ssr: false },
);

export default function Responses() {
  return (
    <div className={cn("no-scrollbar mt-6")}>
      <AllFormVersionsProvider>
        <SelectedProvider>
          <Suspense fallback={<Loading />}>
            <DynamicFormResponsesSidebar />
            <div className={cn("-mt-3 ml-[25.5%]")}>
              <div className={cn("mt-20 h-[570px]")}>
                <DynamicResponseEditor />
              </div>
            </div>
          </Suspense>
        </SelectedProvider>
      </AllFormVersionsProvider>
    </div>
  );
}
