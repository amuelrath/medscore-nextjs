"use client";
import { Card } from "@/components/ui/card";
import { EvaluationWithProgram } from "@/db/client-types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Pinger from "@/components/ui/pinger";
import { Button } from "@/components/ui/button";
import { EllipsisIcon, PowerIcon } from "lucide-react";
import { useState } from "react";

export default function PublishedEvaluationCard({
  publishedEvaluation,
  index,
}: {
  publishedEvaluation: EvaluationWithProgram;
  index: number;
}) {
  return (
    <motion.div
      layoutId={`published-evaluation-card-${publishedEvaluation.id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 * (index + 1) }}
    >
      <Card
        className={cn(
          "col-span-1 transition-all flex flex-col justify-between p-2 select-none"
        )}
      >
        <div className={cn("")}>
          <div>
            <div className={cn("flex flex-row items-center space-x-2")}>
              <h5 className={cn("text-md font-semibold m-0 p-0")}>
                {parseTitle(publishedEvaluation.title)}
              </h5>
              <Pinger variant={"emerald"} size="sm" />
            </div>
            <p className={cn("text-sm text-gray-500 italic hover:underline")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {publishedEvaluation.programs?.name}
            </p>
          </div>
        </div>
        <div>
          <hr className={cn("mb-2")} />
          <div className={cn("flex flex-row justify-end items-center")}>
            <div className={cn("space-x-2")}>
              <ActivateButton />
              <ExamineButton />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function parseTitle(title: string) {
  if (title.length > 43) {
    return title.slice(0, 43) + "...";
  } else {
    return title;
  }
}

function ActivateButton() {
  const [toggled, setToggled] = useState<boolean>(false);

  const handleClick = () => {
    setToggled(!toggled);
  };
  return (
    <Button
      onClick={handleClick}
      variant={toggled ? "emerald" : "default"}
      size={"sm"}
      className={cn("w-28")}
    >
      <PowerIcon />
    </Button>
  );
}

function ExamineButton() {
  return (
    <Button variant={"notepad"} size="sm">
      <EllipsisIcon />
    </Button>
  );
}
