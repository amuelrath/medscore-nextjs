import { ResponseSelectSidebar } from "@/components/(admin)/forms/responsesV3/response-select-sidebar";
import { OverallDataHeader } from "@/components/(admin)/forms/responsesV3/overall-data-header";
import { DynamicContentSection } from "@/components/(admin)/forms/responsesV3/dynamic-content-section";
import { ContextSelectCarousel } from "@/components/(admin)/forms/responsesV3/context-select-carousel";
import { ScorePanel } from "@/components/(admin)/forms/responsesV3/score-panel";

export function ResponseSummary({ formId }: { formId: string }) {
  // prefetch data

  return (
    <main className="flex h-full flex-row">
      <ResponseSelectSidebar />
      <div className="flex h-full w-full flex-col pb-4">
        <OverallDataHeader />
        <div className="w-full h-full p-4 flex flex-row space-x-4" >
            <DynamicContentSection />
            <div className="flex flex-col flex-grow space-y-4" >
              <ContextSelectCarousel />
              <ScorePanel />
            </div>
        </div>
      </div>
    </main>
  );
}

