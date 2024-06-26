import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  MilestoneIcon,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { COMPETENCIES } from "@/db/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

interface Competency {
  id: string;
  name: string;
}

interface Subcompetency {
  id: string;
  competencyId: string;
  name: string;
  level: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  level: number;
  sublevel: number;
}

interface CompetencyCardProps {
  competency: Competency;
  subcompetencies: Subcompetency[];
  openCompetencyId: string | null;
  setOpenCompetencyId: (id: string | null) => void;
  openSubcompetencyId: string | null;
  setOpenSubcompetencyId: (id: string | null) => void;
  selectedMilestoneIds: string[];
  onMilestoneToggle: (id: string) => void;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({
  competency,
  subcompetencies,
  openCompetencyId,
  setOpenCompetencyId,
  openSubcompetencyId,
  setOpenSubcompetencyId,
  selectedMilestoneIds,
  onMilestoneToggle,
}) => {
  const isOpen = openCompetencyId === competency.id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isOpen]);

  return (
    <motion.div
      layout={"position"}
      ref={ref}
      className="border-offset-2 mb-2 w-full rounded-lg border-2 border-gray-400 p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="hide"
        className="w-full justify-between p-2 text-sm font-semibold"
        onClick={() => setOpenCompetencyId(isOpen ? null : competency.id)}
      >
        {competency.name}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2"
          >
            {subcompetencies
              .filter((sub) => sub.competencyId === competency.id)
              .sort((a, b) => a.level - b.level)
              .map((subcompetency) => (
                <SubcompetencyCard
                  key={subcompetency.id}
                  subcompetency={subcompetency}
                  openSubcompetencyId={openSubcompetencyId}
                  setOpenSubcompetencyId={setOpenSubcompetencyId}
                  selectedMilestoneIds={selectedMilestoneIds}
                  onMilestoneToggle={onMilestoneToggle}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface SubcompetencyCardProps {
  subcompetency: Subcompetency;
  openSubcompetencyId: string | null;
  setOpenSubcompetencyId: (id: string | null) => void;
  selectedMilestoneIds: string[];
  onMilestoneToggle: (id: string) => void;
}

const SubcompetencyCard: React.FC<SubcompetencyCardProps> = ({
  subcompetency,
  openSubcompetencyId,
  setOpenSubcompetencyId,
  selectedMilestoneIds,
  onMilestoneToggle,
}) => {
  const isOpen = openSubcompetencyId === subcompetency.id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isOpen]);

  return (
    <motion.div
      layout={"preserve-aspect"}
      ref={ref}
      className={cn(
        "border-offset-2 w-full rounded-lg border-2 border-gray-300 p-2",
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="hide"
        className="w-full justify-between p-1 text-xs font-medium"
        onClick={() => setOpenSubcompetencyId(isOpen ? null : subcompetency.id)}
      >
        {subcompetency.level}: {subcompetency.name}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2"
          >
            {subcompetency.milestones
              .sort((a, b) => a.sublevel - b.sublevel)
              .sort((a, b) => a.level - b.level)
              .map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isSelected={selectedMilestoneIds.includes(milestone.id)}
                  onToggle={() => onMilestoneToggle(milestone.id)}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface MilestoneCardProps {
  milestone: Milestone;
  isSelected: boolean;
  onToggle: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  isSelected,
  onToggle,
}) => (
  <motion.div
    layout
    className={cn(
      "w-full cursor-pointer rounded-lg border p-2 transition-all",
      isSelected
        ? "border-primary bg-primary/10"
        : "border-gray-200 hover:border-primary/50",
    )}
    onClick={onToggle}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium">{milestone.name}</span>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="h-3 w-3 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <p className="mt-1 text-xs text-gray-600">{milestone.description}</p>
  </motion.div>
);

interface MilestoneMultiselectProps {
  value?: string[] | undefined;
  onChange?: (selectedMilestoneIds: string[]) => void;
  defaultValues?: string[];
}

export function MilestoneMultiselect({
  value,
  onChange,
  defaultValues = [],
}: MilestoneMultiselectProps) {
  const { getValues } = useFormContext();
  const formId = getValues(`id`);
  const { data: subcompetencies } = useSuspenseQuery({
    queryKey: ["subcompetencies", formId],
    queryFn: () => getSubcompetencies({ formId }),
  });

  const [openCompetencyId, setOpenCompetencyId] = useState<string | null>(null);
  const [openSubcompetencyId, setOpenSubcompetencyId] = useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValues.length > 0 && value?.length === 0) {
      if (onChange) {
        onChange(defaultValues);
      }
    }
  }, [defaultValues, value, onChange]);

  const handleMilestoneToggle = (milestoneId: string) => {
    const updatedMilestones = value?.includes(milestoneId)
      ? value.filter((id) => id !== milestoneId)
      : [...(value || []), milestoneId];
    if (onChange) {
      onChange(updatedMilestones);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          <span>{value?.length} milestones selected</span>
          <MilestoneIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[650px] flex-col space-y-2 sm:max-w-[425px] md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Milestones</DialogTitle>
          <DialogDescription>
            Select milestones for this question.
          </DialogDescription>
        </DialogHeader>
        <RecommendedMilestone />
        <ScrollArea className="h-[80vh] px-4">
          <div className="flex w-full flex-col items-start space-y-4 pb-4">
            {Object.values(COMPETENCIES).map((competency) => (
              <CompetencyCard
                key={competency.id}
                competency={competency}
                subcompetencies={subcompetencies}
                openCompetencyId={openCompetencyId}
                setOpenCompetencyId={setOpenCompetencyId}
                openSubcompetencyId={openSubcompetencyId}
                setOpenSubcompetencyId={setOpenSubcompetencyId}
                selectedMilestoneIds={value || []}
                onMilestoneToggle={handleMilestoneToggle}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const RecommendedMilestone: React.FC = () => {
  return (
    <motion.div
      className="mb-6 w-full rounded-lg bg-primary/10 p-2 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="mb-2 text-sm font-bold text-primary">Recommended</p>
      <p className="text-lg font-bold">PC 1.1.1</p>
      <div className="mt-2 flex justify-center space-x-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge variant="secondary" className="text-xs">
            Accept
          </Badge>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge variant="outline" className="text-xs">
            See Why
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  );
};
