import { FC } from "react";
import { m } from "framer-motion";
import { Control } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import LetterPullup from "@/components/ui/letter-pull-up";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const DynamicSuggestMilestone = dynamic(() =>
  import("@/components/(admin)/forms/editor/suggest-milestone").then(
    (mod) => mod.SuggestMilestone,
  ),
);
const DynamicInlineMilestoneMultiselect = dynamic(() =>
  import("@/components/(admin)/forms/editor/inline-milestone-input").then(
    (mod) => mod.InlineMilestoneMultiselect,
  ),
);
interface MilestoneMenuProps {
  selectedQuestionIndex: number;
  open: boolean;
  control: Control<TFormSchema>;
  onClose: () => void;
  getPosition: (index: number) => number;
}

export const QuestionDetailsMenu: FC<MilestoneMenuProps> = ({
  selectedQuestionIndex,
  control,
  onClose,
  open,
  getPosition,
}) => {
  return (
    <m.div
      className="border-opacity-18 will-change-auto fixed left-4 top-4 h-[85%] rounded-lg border border-neutral-300 bg-card shadow-lg"
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: open ? "25%" : 0,
        opacity: open ? 1 : 0,
      }}
    >
      {selectedQuestionIndex !== -1 && (
        <div className="px-4">
          <Tabs defaultValue="milestones">
            <div className="flex w-full flex-row items-center justify-between py-3">
              <LetterPullup
                delay={0.005}
                key={selectedQuestionIndex}
                words={`Question ${getPosition(selectedQuestionIndex)}`}
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
            <div className="mb-2 flex justify-center">
              <TabsList>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
              </TabsList>
            </div>
            <hr />
            <TabsContent value="milestones">
              <DynamicInlineMilestoneMultiselect
                key={selectedQuestionIndex}
                control={control}
                name={`formItems.${selectedQuestionIndex}.milestoneIds`}
              />
            </TabsContent>
            <TabsContent value="suggested">
              <DynamicSuggestMilestone
                selectedQuestionIndex={selectedQuestionIndex}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </m.div>
  );
};
