"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  TabsProvider,
  AnimatedTabs,
  TabContent,
} from "@/components/ui/animated-tabs";
import PageHeader from "@/components/ui/page-header";
const tabs = [
  {
    id: "drafts",
    label: "Drafts",
  },
  {
    id: "published",
    label: "Published",
  },
  {
    id: "active",
    label: "Active",
  },
];

export default function EvaluationsRootLayout({
  active,
  drafts,
  published,
}: {
  active: ReactNode;
  drafts: ReactNode;
  published: ReactNode;
}) {
  return (
    <TabsProvider>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Evaluations</h2>
          <AnimatedTabs tabs={tabs} />
        </div>
      </PageHeader>
      <main className={cn("w-full px-4 pb-4")}>
        <TabContent id="drafts">{drafts}</TabContent>
        <TabContent id="published">{published}</TabContent>
        <TabContent id="active">{active}</TabContent>
      </main>
    </TabsProvider>
  );
}
