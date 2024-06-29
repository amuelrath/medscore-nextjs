import { FC } from "react";
import { m } from "framer-motion";
import { Control } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { InlineMilestoneMultiselect } from "@/components/(admin)/forms/editor/inline-milestone-input";
import LetterPullup from "@/components/ui/letter-pull-up";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { SuggestMilestone } from "@/components/(admin)/forms/editor/suggest-milestone";

interface MilestoneMenuProps {
  selectedQuestionIndex: number;
  open: boolean;
  control: Control<TFormSchema>;
  onClose: () => void;
}

export const MilestoneMenu: FC<MilestoneMenuProps> = ({
  selectedQuestionIndex,
  control,
  onClose,
  open,
}) => {
  return (
    <m.div
      className="border-opacity-18 mt-4 h-[93%] rounded-xl border border-white bg-card shadow-lg ring-[2.8px] ring-accent"
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: open ? "45%" : 0,
        opacity: open ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {selectedQuestionIndex !== -1 && (
        <div className="px-4">
          <Tabs defaultValue="milestones">
            <div className="flex w-full py-3 flex-row items-center justify-between">
              <LetterPullup
                delay={0.005}
                key={selectedQuestionIndex}
                words={`Question ${selectedQuestionIndex + 1}`}
              />
              <Button
                onClick={onClose}
                className="bg-transparent"
                variant="outline"
                size="xs"
              >
                Close
              </Button>
            </div>
            <TabsList>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
              <TabsTrigger value="custom">Objectives</TabsTrigger>
            </TabsList>
            <TabsContent value="milestones">
              <InlineMilestoneMultiselect
                control={control}
                name={`questions.${selectedQuestionIndex}.milestoneIds`}
              />
            </TabsContent>
            <TabsContent value="suggested">
              <SuggestMilestone
                selectedQuestionIndex={selectedQuestionIndex}
              />
            </TabsContent>
            <TabsContent value="custom">custom</TabsContent>
          </Tabs>
        </div>
      )}
    </m.div>
  );
};
