"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Section from "@/components/ui/section";
import {
  TabsProvider,
  AnimatedTabs,
  TabContent,
} from "@/components/ui/animated-tabs";
import NavBar from "@/components/ui/top-navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
const tabs = [
  {
    id: "drafts",
    label: "Drafts",
  },
  {
    id: "published",
    label: "Published",
  },
];

export default function EvaluationsRootLayout({
  drafts,
  published,
}: {
  drafts: ReactNode;
  published: ReactNode;
}) {
  return (
    <TabsProvider>
      <NavBar>
        <NavBar.Heading>
          <NavBar.Title>Evaluations</NavBar.Title>
          <NavBar.Subtitle>
            <AnimatedTabs tabs={tabs} />
          </NavBar.Subtitle>
        </NavBar.Heading>
      </NavBar>
      <Section>
        <TabContent id="drafts">{drafts}</TabContent>
        <TabContent id="published">{published}</TabContent>
      </Section>
    </TabsProvider>
  );
}
