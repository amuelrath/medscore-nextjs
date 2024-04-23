"use client";
import { ReactNode } from "react";
import Section from "@/components/ui/section";
import {
  TabsProvider,
  AnimatedTabs,
  TabContent,
} from "@/components/ui/animated-tabs";
import NavBar from "@/components/ui/top-navbar";
const tabs = [
  {
    id: "forms",
    label: "Forms",
  },
  {
    id: "active",
    label: "Active",
  },
];

export default function EvaluationsRootLayout({
  forms,
  active,
}: {
  forms: ReactNode;
  active: ReactNode;
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
        <TabContent id="forms">{forms}</TabContent>
        <TabContent id="active">{active}</TabContent>
      </Section>
    </TabsProvider>
  );
}
