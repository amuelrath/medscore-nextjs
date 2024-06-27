'use client'
import { useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { COMPETENCIES } from "@/db/constants";
import { useFormContext, Controller, Control } from "react-hook-form";
import { CompetencyCard } from "@/components/(admin)/forms/editor/milestone-multiselect";

interface InlineMilestoneMultiselectProps {
  control: Control<any>;
  name: string;
  questionId: string;
}

export function InlineMilestoneMultiselect({
  control,
  name,
  questionId,
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

  // Effect to update the component when questionId changes
  useEffect(() => {
    setOpenCompetencyId(null);
    setOpenSubcompetencyId(null);
  }, [questionId]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="h-[65vh] overflow-y-scroll no-scrollbar relative">
            {Object.values(COMPETENCIES).map((competency) => (
              <CompetencyCard
                key={competency.id}
                competency={competency}
                subcompetencies={subcompetencies}
                openCompetencyId={openCompetencyId}
                setOpenCompetencyId={setOpenCompetencyId}
                openSubcompetencyId={openSubcompetencyId}
                setOpenSubcompetencyId={setOpenSubcompetencyId}
                selectedMilestoneIds={field.value || []}
                onMilestoneToggle={(milestoneId) => {
                  const updatedMilestones = field.value?.includes(milestoneId)
                    ? field.value.filter((id: string) => id !== milestoneId)
                    : [...(field.value || []), milestoneId];
                  field.onChange(updatedMilestones);
                }}
              />
            ))}
        </div>
      )}
    />
  );
}
