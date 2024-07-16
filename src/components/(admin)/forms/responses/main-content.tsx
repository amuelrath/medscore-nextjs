"use client";
import { Tab, TabsBox } from "@/components/ui/tabs-box";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { Answers } from "@/components/(admin)/forms/responses/answers";

export function MainContent() {


  return (
    <section className="h-full w-[65%]">
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
        <Answers  />
      </Suspense>
    ),
  },
  {
    id: "scores",
    label: "Scores",
    content: <>ICS Content</>,
  },
  {
    id: "Insights",
    label: "Insights",
    content: <>Insights Content</>,
  },
];
