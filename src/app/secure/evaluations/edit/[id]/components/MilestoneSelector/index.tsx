"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MilestoneCard from "./MilestoneCard";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientQuestion, ClientSubcompetency } from "@/db/client-types";
import { useContext, createContext, useState, useEffect } from "react";
import { Competency, Milestone } from "@/db/schema";
import SubcompetencyCard from "./SubcompetencyCard";
import CompetencyCard from "./CompetencyCard";
import { cn } from "@/lib/utils";
import { MilestoneIcon } from "lucide-react";
const competencies: Competency[] = [
  { id: "fc6d031b-19f2-4c83-a483-30518ace85c8", name: "PC" },
  {
    id: "c1f839c4-c80c-46c3-ad76-bbbd68e48f2f",
    name: "MK",
  },
  {
    id: "f496f1a0-5664-4b0f-b410-f98400b6e03e",
    name: "SBP",
  },
  {
    id: "6652cf70-066d-46c2-be8c-95de5a926d2f",
    name: "PBLI",
  },
  {
    id: "57d893a3-59e8-4314-a8e8-266f74ab79cc",
    name: "ICS",
  },
  {
    id: "e00dc56b-b8b4-46b0-9dae-bbb0290a33c5",
    name: "P",
  },
];
interface MilestoneSelectorContextValue {
  selectedCompetency: Competency | undefined;
  setSelectedCompetency: (competency: Competency | undefined) => void;
  selectedSubcompetency: ClientSubcompetency | undefined;
  setSelectedSubcompetency: (
    subcompetency: ClientSubcompetency | undefined
  ) => void;
  selectedMilestones: Milestone[] | undefined;
  setSelectedMilestones: (milestone: Milestone[]) => void;
  subcompetencyOptions: ClientSubcompetency[];
  setSubcompetencyOptions: (options: ClientSubcompetency[]) => void;
  milestoneOptions: Milestone[] | undefined;
  setMilestoneOptions: (options: Milestone[]) => void;
  question: ClientQuestion | undefined;
}

const MilestoneSelectorContext = createContext<MilestoneSelectorContextValue>({
  selectedCompetency: undefined,
  setSelectedCompetency: () => {},
  selectedSubcompetency: undefined,
  setSelectedSubcompetency: () => {},
  selectedMilestones: undefined,
  setSelectedMilestones: () => {},
  subcompetencyOptions: [],
  setSubcompetencyOptions: () => {},
  milestoneOptions: [],
  setMilestoneOptions: () => {},
  question: undefined,
});

export const useMilestoneSelector = () => useContext(MilestoneSelectorContext);

export default function MilestoneSelector({
  subcompetencies,
  question,
}: {
  subcompetencies: ClientSubcompetency[];
  question: ClientQuestion;
}) {
  if (!question) {
    return <></>;
  }
  const questionsMilestones = () => {
    const result: Milestone[] = [];

    for (const s of subcompetencies) {
      for (const m of s.milestones) {
        const matchingMilestone = question.milestones.find((allocation) => {
          return allocation.milestoneId === m.id;
        });
        if (matchingMilestone) {
          result.push(m);
        }
      }
    }
    return result;
  };

  const [selectedCompetency, setSelectedCompetency] = useState<Competency>();
  const [selectedSubcompetency, setSelectedSubcompetency] =
    useState<ClientSubcompetency>();
  const [selectedMilestones, setSelectedMilestones] = useState<Milestone[]>(
    questionsMilestones()
  );
  const [subcompetencyOptions, setSubcompetencyOptions] = useState<
    ClientSubcompetency[]
  >([]);
  const [milestoneOptions, setMilestoneOptions] = useState<Milestone[]>([]);
  const contextValue: MilestoneSelectorContextValue = {
    selectedCompetency,
    setSelectedCompetency,
    selectedSubcompetency,
    setSelectedSubcompetency,
    selectedMilestones,
    setSelectedMilestones,
    subcompetencyOptions,
    setSubcompetencyOptions,
    milestoneOptions,
    setMilestoneOptions,
    question: question,
  };

  // reset selected subcompetency (options) and milestone (options) when selected competency changes
  useEffect(() => {
    setSelectedSubcompetency(undefined);
    setMilestoneOptions([]);
    setSubcompetencyOptions(() => {
      if (selectedCompetency) {
        return subcompetencies.filter(
          (sc) => sc.competencyId === selectedCompetency.id
        );
      }
      return [];
    });
  }, [selectedCompetency]);

  // set milestone options when selected subcompetency changes
  useEffect(() => {
    setMilestoneOptions(() => {
      if (selectedSubcompetency) {
        return selectedSubcompetency.milestones;
      }
      return [];
    });
  }, [selectedSubcompetency]);

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          "group-hover:opacity-100 opacity-0 font-poppins p-1 cursor-pointer hover:bg-primary hover:text-white transition-all rounded-full"
        )}
      >
        <MilestoneIcon size={"1rem"} />
      </DrawerTrigger>
      <DrawerContent className={cn("h-[90%]")}>
        <DrawerHeader>
          <DrawerTitle className={cn("text-xl")}>Milestones</DrawerTitle>
          <DrawerDescription>
            Add Milestones to Question #{question.position}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className={cn("h-full")}>
          <div className={cn("w-full h-full p-4 space-y-4")}>
            <MilestoneSelectorContext.Provider value={contextValue}>
              <AnimatePresence>
                {selectedCompetency ? (
                  <CompetencyCard
                    key={selectedCompetency.id}
                    competency={selectedCompetency}
                  />
                ) : (
                  competencies.map((c) => (
                    <CompetencyCard key={c.id} competency={c} />
                  ))
                )}
              </AnimatePresence>
              <AnimatePresence>
                {selectedSubcompetency ? (
                  <SubcompetencyCard
                    key={selectedSubcompetency.id}
                    subcompetency={selectedSubcompetency}
                  />
                ) : (
                  subcompetencyOptions.map((sc) => (
                    <SubcompetencyCard key={sc.id} subcompetency={sc} />
                  ))
                )}
              </AnimatePresence>
              <AnimatePresence>
                {milestoneOptions.map((m) => (
                  <MilestoneCard
                    competencyName={selectedCompetency?.name || ""}
                    key={m.id}
                    milestone={m}
                  />
                ))}
              </AnimatePresence>
            </MilestoneSelectorContext.Provider>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
