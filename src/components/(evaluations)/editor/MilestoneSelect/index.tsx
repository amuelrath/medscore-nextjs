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
import { TSubcompetencyRelate } from "@/db/types";
import { useState, createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MilestoneIcon } from "lucide-react";
import CompetencyCard from "./CompetencyCard";
import { AnimatePresence } from "framer-motion";
const competencies: Competency[] = [
  { id: "d50cfe89-d627-4431-ad17-42fac27bfb35", name: "PC" },
  {
    id: "71c6c8a9-1880-4d0c-8f2e-71f8f2757095",
    name: "MK",
  },
  {
    id: "05ae7c1e-2640-48de-b3d3-c1b3157d4ad9",
    name: "SBP",
  },
  {
    id: "44756a6a-eaf8-44c6-a97b-9a0a298c384e",
    name: "PBLI",
  },
  {
    id: "5a8776bb-a705-4af2-9504-dc20e4daaf05",
    name: "ICS",
  },
  {
    id: "30526e3d-6020-4caa-a4fc-ca8ccfb41437",
    name: "P",
  },
];

type Allocation = {
  milestoneId: string;
};

const MilestoneSelectorContext = createContext<{
  value: Allocation[];
  subcompetencies: TSubcompetencyRelate[] | undefined;
  selectedCompetencyId: string | undefined;
  selectedSubcompetencyId: string | undefined;
  selectedMilestoneIds: Allocation[] | undefined;
  setSelectedCompetencyId: (id: string | undefined) => void;
  setSelectedSubcompetencyId: (id: string | undefined) => void;
  setSelectedMilestoneIds: (ids: Allocation[]) => void;
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
  values: Allocation[];
  subcompetencies: TSubcompetencyRelate[];
  onChange: (milestonesIds: Allocation[]) => void;
}) {
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<
    string | undefined
  >(undefined);
  const [selectedSubcompetencyId, setSelectedSubcompetencyId] = useState<
    string | undefined
  >(undefined);
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<
    Allocation[]
  >(values || []);

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

  const handleChange = (selectedMilestoneIds: Allocation[]) => {
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
