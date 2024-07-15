import { FC } from "react";
import { CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";

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

export const CompetencyCard: FC<CompetencyCardProps> = ({
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

  return (
    <div className="mb-2 w-full">
      <LazyMotion features={domAnimation}>
        <m.div
          layout="position"
          className={cn(
            "border-offset-2 w-full rounded-lg border-2 p-2 transition-all ",
            isOpen
              ? "sticky top-0 z-10 bg-primary"
              : "bg-background",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="hide"
            className={cn(
              "w-full justify-between p-2 text-wrap text-left text-xs font-semibold",
              isOpen ? " text-white" : "text-neutral-700",
            )}
            onClick={() => setOpenCompetencyId(isOpen ? null : competency.id)}
          >
            {competency.name}
            <m.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </m.div>
          </Button>
        </m.div>
        <AnimatePresence>
          {isOpen && (
            <m.div
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
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
};

interface SubcompetencyCardProps {
  subcompetency: Subcompetency;
  openSubcompetencyId: string | null;
  setOpenSubcompetencyId: (id: string | null) => void;
  selectedMilestoneIds: string[];
  onMilestoneToggle: (id: string) => void;
}

export const SubcompetencyCard: FC<SubcompetencyCardProps> = ({
  subcompetency,
  openSubcompetencyId,
  setOpenSubcompetencyId,
  selectedMilestoneIds,
  onMilestoneToggle,
}) => {
  const isOpen = openSubcompetencyId === subcompetency.id;

  return (
    <div className="w-full px-1">
      <m.div
        layout="position"
        className={cn(
          "w-full rounded-md p-2",
          isOpen
            ? "sticky top-16 z-20 bg-[#378794]"
            : "bg-background",
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="hide"
          className={cn(
            "w-full justify-between p-1 text-xs text-left text-wrap font-medium",
            isOpen ? "text-white" : "text-gray-600",
          )}
          onClick={() =>
            setOpenSubcompetencyId(isOpen ? null : subcompetency.id)
          }
        >
          {subcompetency.level}: {subcompetency.name}
          <m.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </m.div>
        </Button>
      </m.div>
      <AnimatePresence>
        {isOpen && (
          <m.div
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
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MilestoneCard: FC<MilestoneCardProps> = ({
  milestone,
  isSelected,
  onToggle,
}) => (
  <div className="px-3">
    <m.div
      layout
      className={cn(
        "w-full cursor-pointer rounded-lg border p-2 transition-all",
        isSelected
          ? "border-accent-secondary bg-accent-secondary-background"
          : "border-gray-200 hover:border-[#99D6FF]",
      )}
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium",
            isSelected ? "text-[#1A365D]" : "text-gray-700",
          )}
        >
          {milestone.name}
        </span>
        <AnimatePresence>
          {isSelected && (
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="h-3 w-3 text-accent-secondary" />
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <p
        className={cn(
          "mt-1 text-xs",
          isSelected ? "text-[#1A365D]" : "text-gray-600",
        )}
      >
        {milestone.description}
      </p>
    </m.div>
  </div>
);

interface MilestoneCardProps {
  milestone: Milestone;
  isSelected: boolean;
  onToggle: () => void;
}
