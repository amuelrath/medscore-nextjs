"use client";
import { cn } from "@/lib/utils";
import {
  BrainIcon,
  CogIcon,
  HandshakeIcon,
  MilestoneIcon,
  ShapesIcon,
  SpeechIcon,
  StethoscopeIcon,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ClientMilestone, ClientQuestion } from "@/db/client-types";
// TODO FORMAT FOR MOBILE BROWSER

type CoreCompetency = "MK" | "ICS" | "SBP" | "PBLI" | "PC" | "P";
const CoreCompetencies = ["MK", "ICS", "SBP", "PBLI", "PC", "P"] as const;

export default function MilestoneSelector({
  milestones,
  question,
}: {
  milestones: ClientMilestone[];
  question: ClientQuestion;
}) {
  const options = milestones.map((milestone) => ({
    value: milestone.id,
    label: milestone.description,
  }));
  return (
    <Drawer>
      <DrawerTrigger>
        <div
          role="button"
          className={cn(
            "group-hover:opacity-100 opacity-0 font-poppins p-1 cursor-pointer hover:bg-primary hover:text-white transition-all rounded-full"
          )}
        >
          <MilestoneIcon size={"1rem"} />
        </div>
      </DrawerTrigger>
      <DrawerContent className={cn("h-[80%]")}>
        <DrawerHeader>
          <DrawerTitle className={cn("text-xl")}>Milestones</DrawerTitle>
          <DrawerDescription className={cn("text-md")}>
            Adding Milestones to Question #{question.position}
          </DrawerDescription>
        </DrawerHeader>
        <div className={cn("w-full h-full grid grid-cols-3 gap-4 p-2")}>
          {CoreCompetencies.map((competency) => (
            <CompetencyCard competency={competency} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CompetencyCard({ competency }: { competency: CoreCompetency }) {
  const competencyColors: Record<CoreCompetency, string> = {
    ICS: "bg-emerald-500",
    SBP: "bg-orange-600",
    P: "bg-sky-600",
    PBLI: "bg-cyan-800",
    PC: "bg-violet-700",
    MK: "bg-rose-700",
  };

  const competencyNames: Record<CoreCompetency, string> = {
    ICS: "Interpersonal Communication Skills",
    SBP: "Systems-Based Practice",
    P: "Professionalism",
    PBLI: "Practice-Based Learning and Improvement",
    PC: "Patient Care",
    MK: "Medical Knowledge",
  };
  const colorClass = competencyColors[competency];

  const competencyIcon: Record<CoreCompetency, React.ReactNode> = {
    ICS: <SpeechIcon className="size-32" />,
    SBP: <CogIcon className="size-32 " />,
    P: <HandshakeIcon className="size-32 " />,
    PBLI: <ShapesIcon className="size-32 " />,
    PC: <StethoscopeIcon className="size-32 " />,
    MK: <BrainIcon className="size-32 " />,
  };

  return (
    <div
      className={cn(
        "hover:opacity-85 transition-all p-4 col-span-1 h-full rounded-2xl border hover:shadow-lg hover:-translate-y-5 transition-all",
        colorClass
      )}
    >
      <div className={cn("flex flex-col space-y-8")}>
        <h3 className={cn("text-xl font-bold font-poppins text-white")}>
          {competencyNames[competency]}
        </h3>
        <div className="text-white">{competencyIcon[competency]}</div>
      </div>
    </div>
  );
}
