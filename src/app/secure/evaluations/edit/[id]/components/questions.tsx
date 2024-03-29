"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InferResultType } from "@/db/utils";
import { Card } from "@/components/ui/card";
import { Option } from "@/db/schema";
import AddQuestion from "./add-question";
import DeleteQuestion from "./delete-question";
import { ScrollArea } from "@/components/ui/scroll-area";
type QueryResult = InferResultType<
  "evaluations",
  { questions: { with: { options: true } } }
>;

export default function QuestionList({
  evaluation,
}: {
  evaluation: QueryResult;
}) {
  const sortedQuestions = evaluation.questions.sort(
    (a, b) => a.position! - b.position!
  );

  return (
    <motion.div layout>
      <AnimatePresence>
        {sortedQuestions.map((question, index) => (
          <motion.div
            layout
            className={cn("space-y-4 p-2")}
            key={question.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1, delay: index * 0.1 }}
          >
            <QuestionCard question={question} />
          </motion.div>
        ))}
        <motion.div
          layoutId="add-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.1 }}
          className={cn("flex flex-row justify-center")}
        >
          <AddQuestion evaluationId={evaluation.id} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

type QuestionWithOptions = InferResultType<"questions", { options: true }>;
function QuestionCard({ question }: { question: QuestionWithOptions }) {
  return (
    <Card className={cn("p-4 flex flex-col")}>
      <div className={cn("flex flex-row justify-between")}>
        {question.position}.
        <DeleteQuestion questionId={question.id} />
      </div>
      {question.text}text here
      <br />
      <OptionList options={question.options} />
    </Card>
  );
}

function Option({ option }: { option: Option }) {
  return <div>{option.text}</div>;
}

function OptionList({ options }: { options: Option[] }) {
  return (
    <div className={cn("")}>
      {options.map((option, index) => (
        <motion.div
          className={cn("")}
          key={option.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Option key={option.id} option={option} />
        </motion.div>
      ))}
    </div>
  );
}
