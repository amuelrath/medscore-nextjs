"use client";
import { ResponseQuestions } from "@/components/(admin)/forms/responses/response-questions";
import { InfoSidebar } from "@/components/(admin)/forms/responses/info-sidebar";
import {
  DirectionAwareContent,
  DirectionAwareTabs,
  DirectionAwareTabsProvider,
} from "@/components/ui/direction-aware-tabs";
import { Glass } from "@/components/ui/glass";
import { ResponsePerformance } from "@/components/(admin)/forms/responses/response-performance";
import { FormNotAdministered } from "@/components/(admin)/forms/responses/errors/form-not-administered";

export function ResponsesContent() {


  if (!responses || responses.length === 0) {
    return <FormNotAdministered />;
  }

  const tabs = [
    {
      id: 0,
      label: "Questions",
      content: <ResponseQuestions />,
    },
    {
      id: 1,
      label: "Performance",
      content: <ResponsePerformance />,
    },
  ];

  return (
    <div className="grid grid-cols-9 gap-x-0.5 pt-2">
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
      <Glass className="col-span-2" />
    </div>
  );
}
