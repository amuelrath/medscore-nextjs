"use client";
import { useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { COMPETENCIES } from "@/db/constants";
import { useFormContext, Controller, Control, useWatch } from "react-hook-form";
import { CompetencyCard } from "@/components/(admin)/forms/editor/milestone-multiselect";

interface InlineMilestoneMultiselectProps {
  control: Control<any>;
  name: string;
}

export function InlineMilestoneMultiselect({
  control,
  name,
}: InlineMilestoneMultiselectProps) {
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

  // Watch for changes in the milestones
  const selectedMilestones = useWatch({ control, name });

  // Effect to update the component when questionId changes
  useEffect(() => {
    setOpenCompetencyId(null);
    setOpenSubcompetencyId(null);
  }, [name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="no-scrollbar relative h-[65vh] overflow-y-scroll">
          {Object.values(COMPETENCIES).map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              subcompetencies={subcompetencies}
              openCompetencyId={openCompetencyId}
              setOpenCompetencyId={setOpenCompetencyId}
              openSubcompetencyId={openSubcompetencyId}
              setOpenSubcompetencyId={setOpenSubcompetencyId}
              selectedMilestoneIds={selectedMilestones || []}
              onMilestoneToggle={(milestoneId) => {
                const updatedMilestones = selectedMilestones?.includes(
                  milestoneId,
                )
                  ? selectedMilestones.filter(
                      (id: string) => id !== milestoneId,
                    )
                  : [...(selectedMilestones || []), milestoneId];
                field.onChange(updatedMilestones);
              }}
            />
          ))}
        </div>
      )}
    />
  );
}
