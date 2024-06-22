"use client";
import { Main } from "@/components/ui/main";
import { ResponseSidebar } from "@/components/(admin)/forms/responsesV2/response-sidebar";
import { InfoSidebar } from "@/components/(admin)/forms/responsesV2/info-sidebar";
import {
  DirectionAwareContent,
  DirectionAwareTabs,
  DirectionAwareTabsProvider
} from "@/components/ui/direction-aware-tabs";
import { ResponseProvider } from "@/components/(admin)/forms/providers/response-provider";
import { ResponseQuestions } from "@/components/(admin)/forms/responsesV2/response-questions";


export function ResponsesV2({ formId }: { formId: string }) {
  const tabs = [
    {
      id: 0,
      label: "Questions",
      content: <ResponseQuestions />,
    },
    {
      id: 1,
      label: "Details",
      content: <div>nothing</div>,
    },
  ];

  return (
    <Main>
      <ResponseProvider formId={formId}>
        <div className="grid grid-cols-9 gap-x-0.5">
          <InfoSidebar />
          <div className="relative col-span-5 col-start-3">
            <DirectionAwareTabsProvider bubbleId={"response"} tabs={tabs}>
              <div className="flex w-full justify-center">
                <DirectionAwareTabs
                  size={"md"}
                  variant={"secondary"}
                  color={"outline"}
                  className={"relative z-10"}
                />
              </div>
              <DirectionAwareContent />
            </DirectionAwareTabsProvider>
          </div>
          <ResponseSidebar />
        </div>
      </ResponseProvider>
    </Main>
  );
}
