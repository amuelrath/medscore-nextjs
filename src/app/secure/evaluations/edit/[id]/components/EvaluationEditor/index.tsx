"use client";
import { ClientEvaluation, ClientQuestion } from "@/db/client-types";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "./Questions";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { createQuestion } from "../actions";
import { changeEvaluationTitle } from "../actions";

export default function EvaluationEditor({
  evaluation,
}: {
  evaluation: ClientEvaluation;
}) {
  const handleAddQuestion = async () => {
    await createQuestion(evaluation.id);
  };

  // TOTO DEBOUNCE
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    changeEvaluationTitle(evaluation.id, e.target.value);
  };

  const subcompetencies = evaluation.programs.specialties?.subcompetencies;

  return (
    <div>
      <AnimatePresence key={"evaluation-editor"}>
        <motion.div layout className={cn("p-4 space-y-4")}>
          {[...evaluation.questions]
            .sort((a, b) => a.position! - b.position!)
            .map((q: ClientQuestion, index) => {
              return (
                <motion.div
                  layout="position"
                  layoutId={`question-${q.id}`}
                  key={`question-card-${q.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                >
                  <QuestionCard
                    question={q}
                    index={index}
                    subcompetencies={subcompetencies || []}
                  />
                </motion.div>
              );
            })}
          <motion.div layout className={cn("flex justify-center")}>
            <motion.div
              layoutId="add-question"
              className={cn(
                "hover:text-white hover:bg-primary transition-all rounded-full p-1 cursor-pointer"
              )}
              onClick={handleAddQuestion}
            >
              <PlusCircleIcon />
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
