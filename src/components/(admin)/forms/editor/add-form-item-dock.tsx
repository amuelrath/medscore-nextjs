import { TFormItemType } from "@/db/schema";
import { motion } from "framer-motion";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Button } from "@/components/ui/button";
import {
  CheckCheckIcon,
  CheckIcon,
  HeadingIcon,
  NotebookPenIcon,
} from "lucide-react";
import React from "react";

export function AddFormItemDock({
  addQuestion,
}: {
  addQuestion: (type: TFormItemType) => void;
}) {
  return (
    <motion.div
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="flex flex-col items-center space-y-2 rounded-lg border border-neutral-300 bg-card p-1 drop-shadow-sm"
    >
      <SimpleTooltip
        description={"Single-choice"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[112px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("SINGLE_CHOICE")}
        >
          <CheckIcon size={16} />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip
        description={"Multiple-choice"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[120px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("MULTIPLE_CHOICE")}
        >
          <CheckCheckIcon size={16} />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip
        description={"Written"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[70px] "
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => addQuestion("WRITTEN")}
        >
          <NotebookPenIcon size={16} />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip
        description={"Heading"}
        delay={0}
        contentClassName="absolute -top-2 left-11 w-[80px] "
      >
        <Button variant="ghost" size="xs" onClick={() => addQuestion("HEADER")}>
          <HeadingIcon size={16} />
        </Button>
      </SimpleTooltip>
    </motion.div>
  );
}
