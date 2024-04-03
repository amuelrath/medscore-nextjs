"use client";
import { ClientEvaluation, ClientQuestion } from "@/db/client-types";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "./questions";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { createQuestion } from "../../actions";

export default function EvaluationEditor({
  evaluation,
}: {
  evaluation: ClientEvaluation;
}) {
  const handleAddQuestion = async () => {
    await createQuestion(evaluation.id);
  };

  return (
    <div className={cn("p-2 space-y-2")}>
      <AnimatePresence>
        {[...evaluation.questions]
          .sort((a, b) => a.position! - b.position!)
          .map((q: ClientQuestion, index) => {
            return (
              <motion.div
                layout
                key={`question-${q.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <QuestionCard question={q} index={index} />
              </motion.div>
            );
          })}
      </AnimatePresence>
      <div className={cn("flex justify-center")}>
        <div
          className={cn(
            "hover:text-white hover:bg-primary transition-all rounded-full p-1 cursor-pointer"
          )}
          onClick={handleAddQuestion}
        >
          <PlusCircleIcon />
        </div>
      </div>
    </div>
  );
}
