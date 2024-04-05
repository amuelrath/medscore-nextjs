"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainIcon,
  CogIcon,
  HandshakeIcon,
  MilestoneIcon,
  ShapesIcon,
  SpeechIcon,
  StethoscopeIcon,
  XIcon,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ClientMilestone,
  ClientQuestion,
  ClientSubcompetency,
} from "@/db/client-types";
import { Competency, Milestone } from "@/db/schema";

type CoreCompetency = "MK" | "ICS" | "SBP" | "PBLI" | "PC" | "P";
const CoreCompetencies = ["MK", "ICS", "SBP", "PBLI", "PC", "P"] as const;
const competencyColors: Record<CoreCompetency, string> = {
  ICS: "bg-emerald-500",
  SBP: "bg-orange-600",
  P: "bg-sky-600",
  PBLI: "bg-cyan-800",
  PC: "bg-violet-700",
  MK: "bg-rose-700",
};
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
const competencyNames: Record<CoreCompetency, string> = {
  ICS: "Interpersonal Communication Skills",
  SBP: "Systems-Based Practice",
  P: "Professionalism",
  PBLI: "Practice-Based Learning and Improvement",
  PC: "Patient Care",
  MK: "Medical Knowledge",
};
const competencyIcon: Record<CoreCompetency, React.ReactNode> = {
  ICS: <SpeechIcon className="size-16" />,
  SBP: <CogIcon className="size-16" />,
  P: <HandshakeIcon className="size-16" />,
  PBLI: <ShapesIcon className="size-16" />,
  PC: <StethoscopeIcon className="size-16" />,
  MK: <BrainIcon className="size-16" />,
};

export default function MilestoneSelector({
  subcompetencies,
  question,
}: {
  subcompetencies: ClientSubcompetency[];
  question: ClientQuestion;
}) {
  const [selectedCompetency, setSelectedCompetency] = useState<
    Competency | undefined
  >(undefined);

  const [subcompetencyOptions, setSubcompetencyOptions] = useState<
    ClientSubcompetency[]
  >([]);

  const [selectedSubcompetency, setSelectedSubcompetency] = useState<
    ClientSubcompetency | undefined
  >(undefined);

  const [milestoneOptions, setMilestoneOptions] = useState<Milestone[]>([]);

  useEffect(() => {
    if (selectedCompetency && subcompetencies) {
      setSubcompetencyOptions([]);
      setSubcompetencyOptions(
        subcompetencies.filter(
          (sc) => sc.competencyId === selectedCompetency.id
        )
      );
    }
  }, [selectedCompetency, subcompetencies]);

  useEffect(() => {
    if (selectedSubcompetency && selectedSubcompetency.milestones) {
      setMilestoneOptions([]);
      setMilestoneOptions(selectedSubcompetency.milestones);
    }
  }, [selectedSubcompetency]);

  const handleDeselectCompetency = () => {
    setSelectedCompetency(undefined);
    setSubcompetencyOptions([]);
    setMilestoneOptions([]);
  };

  const handleDeselectSubcompetency = () => {
    setSelectedSubcompetency(undefined);
    setMilestoneOptions([]);
  };

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
      <DrawerContent className={cn("h-[90%]")}>
        <DrawerHeader>
          <DrawerTitle className={cn("text-xl")}>Milestones</DrawerTitle>
          <DrawerDescription className={cn("text-md")}>
            Adding Milestones to Question #{question.position}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className={cn("h-full")}>
          <div className={cn("w-full h-full p-4 space-y-4")}>
            <AnimatePresence>
              {selectedCompetency === undefined &&
                competencies.map((competency) => (
                  <CompetencyCard
                    key={`${competency.id}`}
                    competency={competency}
                    onSelect={setSelectedCompetency}
                  />
                ))}
              {selectedCompetency && (
                <motion.div
                  layout="preserve-aspect"
                  key={selectedCompetency.id}
                  layoutId={selectedCompetency.id}
                  animate={{
                    height: "60px",
                    width: "full",
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border",
                    competencyColors[selectedCompetency.name as CoreCompetency]
                  )}
                >
                  <div className={cn("flex flex-col space-y-8")}>
                    <h3
                      className={cn(
                        "text-xl font-bold font-poppins text-white flex flex-row items-center justify-between"
                      )}
                    >
                      {
                        competencyNames[
                          selectedCompetency.name as CoreCompetency
                        ]
                      }
                      <XIcon onClick={handleDeselectCompetency} />
                    </h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {selectedCompetency &&
                subcompetencyOptions?.map((sc, index) => (
                  <div className={cn("px-4")}>
                    <SubcompetencyCard
                      selectedSubcompetency={selectedSubcompetency || undefined}
                      onDeselect={handleDeselectSubcompetency}
                      onSelect={setSelectedSubcompetency}
                      index={index}
                      subcompetency={sc}
                      key={sc.id}
                    />
                  </div>
                ))}
            </AnimatePresence>
            <AnimatePresence>
              <motion.div>
                {selectedSubcompetency &&
                  milestoneOptions &&
                  milestoneOptions.map((m, index) => (
                    <li key={m.id}>{m.name}</li>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function CompetencyCard({
  competency,
  onSelect,
}: {
  competency: Competency;
  onSelect: (selectedCompetency: Competency) => void;
}) {
  const colorClass = competencyColors[competency.name as CoreCompetency];

  return (
    <motion.div
      layout="position"
      layoutId={competency.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 6px 12px 6px rgba(0,0,0,0.2)",
      }}
      transition={{ duration: 0.1 }}
      className={cn(
        "cursor-pointer p-4 h-28 rounded-2xl border items-center",
        colorClass
      )}
      onClick={() => onSelect(competency)}
    >
      <div className={cn("flex flex-row justify-between")}>
        <h3 className={cn("text-xl font-bold font-poppins text-white")}>
          {competencyNames[competency.name as CoreCompetency]}
        </h3>
        <div className="text-white">
          {competencyIcon[competency.name as CoreCompetency]}
        </div>
      </div>
    </motion.div>
  );
}

function SubcompetencyCard({
  onDeselect,
  onSelect,
  subcompetency,
  index,
  selectedSubcompetency,
}: {
  subcompetency: ClientSubcompetency;
  index: number;
  onSelect: (selectedSubcompetency: ClientSubcompetency) => void;
  onDeselect: () => void;
  selectedSubcompetency: ClientSubcompetency | undefined;
}) {
  const subcompetencyColors: Record<CoreCompetency, string> = {
    ICS: "bg-emerald-300",
    SBP: "bg-orange-400",
    P: "bg-sky-400",
    PBLI: "bg-cyan-600",
    PC: "bg-violet-500",
    MK: "bg-rose-500",
  };

  return (
    <div onClick={() => onSelect(subcompetency)}>
      <motion.div
        layout="position"
        layoutId={subcompetency.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 * (index + 1) }}
        whileHover={{
          y: -5,
          boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)",
        }}
        className={cn(
          "w-full font-bold cursor-pointer p-4 h-12 rounded-2xl border flex flex row justify-between items-center text-white",
          subcompetencyColors[subcompetency.competencies.name as CoreCompetency]
        )}
      >
        <p>{subcompetency.name}</p>
        {selectedSubcompetency?.id === subcompetency.id && (
          <XIcon onClick={onDeselect} />
        )}
      </motion.div>
    </div>
  );
}
