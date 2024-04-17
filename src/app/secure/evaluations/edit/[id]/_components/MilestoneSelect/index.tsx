"use client";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Competency } from "@/db/schema";
import { ClientSubcompetency } from "@/db/client-types";
import { useState, createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MilestoneIcon } from "lucide-react";
import CompetencyCard from "./CompetencyCard";
import { AnimatePresence } from "framer-motion";
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

const MilestoneSelectorContext = createContext<{
  value: string[];
  subcompetencies: ClientSubcompetency[] | undefined;
  selectedCompetencyId: string | undefined;
  selectedSubcompetencyId: string | undefined;
  selectedMilestoneIds: string[] | undefined;
  setSelectedCompetencyId: (id: string | undefined) => void;
  setSelectedSubcompetencyId: (id: string | undefined) => void;
  setSelectedMilestoneIds: (ids: string[]) => void;
}>({
  value: [],
  subcompetencies: undefined,
  selectedCompetencyId: undefined,
  selectedSubcompetencyId: undefined,
  selectedMilestoneIds: undefined,
  setSelectedCompetencyId: () => undefined,
  setSelectedSubcompetencyId: () => undefined,
  setSelectedMilestoneIds: () => undefined,
});

export const useMilestoneSelector = () => useContext(MilestoneSelectorContext);

export default function MilestoneSelector({
  values,
  subcompetencies,
  onChange,
}: {
  values: string[];
  subcompetencies: ClientSubcompetency[];
  onChange: (milestonesIds: string[]) => void;
}) {
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<
    string | undefined
  >(undefined);
  const [selectedSubcompetencyId, setSelectedSubcompetencyId] = useState<
    string | undefined
  >(undefined);
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>(
    values || []
  );

  const contextValue = {
    value: values,
    subcompetencies: subcompetencies,
    setSelectedCompetencyId,
    setSelectedSubcompetencyId,
    setSelectedMilestoneIds,
    selectedCompetencyId,
    selectedMilestoneIds,
    selectedSubcompetencyId,
  };

  const handleChange = (selectedMilestoneIds: string[]) => {
    onChange(selectedMilestoneIds);
  };

  useEffect(() => {
    handleChange(selectedMilestoneIds);
  }, [selectedMilestoneIds]);

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
          <DrawerDescription>Select Milestones</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className={cn("h-full")}>
          <div className={cn("w-full h-full p-4 space-y-4")}>
            <MilestoneSelectorContext.Provider value={contextValue}>
              <AnimatePresence>
                {selectedCompetencyId ? (
                  <CompetencyCard
                    key={selectedCompetencyId}
                    competency={
                      competencies.find((c) => c.id === selectedCompetencyId)!
                    }
                  />
                ) : (
                  competencies.map((c) => (
                    <CompetencyCard key={c.id} competency={c} />
                  ))
                )}
              </AnimatePresence>
            </MilestoneSelectorContext.Provider>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
