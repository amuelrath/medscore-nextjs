'use client'
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { ResponseQuestions } from "@/components/(admin)/forms/responsesV2/response-questions";
import { InfoSidebar } from "@/components/(admin)/forms/responsesV2/info-sidebar";
import {
  DirectionAwareContent,
  DirectionAwareTabs,
  DirectionAwareTabsProvider
} from "@/components/ui/direction-aware-tabs";
import { ResponseSidebar } from "@/components/(admin)/forms/responsesV2/response-sidebar";

export function ResponsesContent() {
  const { isLoading, error, versions } = useResponseContext();

  if (isLoading) {
    return ;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!versions || versions.length === 0) {
    return <div>This form hasn&apos;t been administered yet.</div>;
  }

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
  );
}