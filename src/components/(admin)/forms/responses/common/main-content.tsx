"use client";
import { Tab, TabsBox } from "@/components/ui/tabs-box";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { Response } from "@/components/(admin)/forms/responses/response";
import { Competency } from "@/components/(admin)/forms/responses/competency/competency";
import { Insights } from "@/components/(admin)/forms/responses/insights/insights";

export function MainContent() {
  return (
    <section className="h-full w-full">
      <TabsBox tabs={tabs} />
    </section>
  );
}

const tabs: Tab[] = [
  {
    id: "response",
    label: "Response",
    content: (
      <Suspense fallback={<Loading />}>
        <Response />
      </Suspense>
    ),
  },
  {
    id: "competency",
    label: "Competency",
    content: (
      <Suspense fallback={<Loading />}>
        <Competency />
      </Suspense>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    content: <Insights />,
  },
];
