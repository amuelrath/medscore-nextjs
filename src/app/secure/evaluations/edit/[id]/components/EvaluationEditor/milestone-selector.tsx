"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getMilestones } from "../../actions";
import {
  ArrowUpNarrowWide,
  BrainIcon,
  ChevronDownCircleIcon,
  ChevronUpCircleIcon,
  CogIcon,
  HandshakeIcon,
  MilestoneIcon,
  ShapesIcon,
  SpeechIcon,
  StethoscopeIcon,
} from "lucide-react";
import Select, {
  ClassNamesConfig,
  DropdownIndicatorProps,
  InputProps,
  components,
} from "react-select";
import { db } from "@/db";
import { Milestone } from "@/db/schema";
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

type CoreCompetency = "MK" | "ICS" | "SBP" | "PBLI" | "PC" | "P";
const CoreCompetencies = ["MK", "ICS", "SBP", "PBLI", "PC", "P"] as const;

const styles = {
  container: (state) => "font-forma",
  menu: (state) => "bg-black",
  control: (state) => "font-forma",
  input: (state) => "font-forma  py-1.5",
  placeholder: (state) => "hidden",
  dropdownIndicator: (state) =>
    "absolute text-sm p-1 hover:bg-primary hover:text-white transition-all rounded-full",
  menuList: (state) => "bg-white border space-y-4",
} as ClassNamesConfig;

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
          <DrawerTitle>Milestones</DrawerTitle>
          <DrawerDescription>
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
