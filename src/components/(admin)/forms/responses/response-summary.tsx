import { ResponseSelectSidebar } from "@/components/(admin)/forms/responses/response-select-sidebar";
import { OverallDataHeader } from "@/components/(admin)/forms/responses/overall-data-header";
import { DynamicContentSection } from "@/components/(admin)/forms/responses/dynamic-content-section";
import { ContextSelectCarousel } from "@/components/(admin)/forms/responses/context-select-carousel";
import { ScorePanel } from "@/components/(admin)/forms/responses/score-panel";


export function ResponseSummary({ formId }: { formId: string }) {
  return (
    <main className="flex h-full flex-row">
      <ResponseSelectSidebar formId={formId} />
      <div className="flex h-full w-full flex-col pb-4">
        <OverallDataHeader />
        <div className="flex h-full w-full flex-row space-x-4 p-4">
          <DynamicContentSection />
          <div className="flex flex-grow flex-col space-y-4">
            <ContextSelectCarousel />
            <ScorePanel />
          </div>
        </div>
      </div>
    </main>
  );
}
