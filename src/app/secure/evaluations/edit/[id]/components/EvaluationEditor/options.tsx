// options.tsx

"use client";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Option as OptionType } from "@/db/schema";
import { deleteOption, updateOption } from "../../actions";
import { motion, AnimatePresence } from "framer-motion";

export function Option({ option }: { option: OptionType }) {
  const handleRemoveOption = async () => {
    await deleteOption(option.id);
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateOption(option.id, { text: e.target.value });
  };

  const handlePointValueChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await updateOption(option.id, { pointValue: e.target.value });
  };

  return (
    <motion.div
      layout="position"
      layoutId={`option-${option.id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-center space-x-2 group w-full")}
    >
      <Input
        defaultValue={option.text || ""}
        onChange={handleTextChange}
        className={cn("p-2 border rounded-md")}
        placeholder={"Option"}
      />
      <Input
        placeholder="Points"
        defaultValue={Number(option.pointValue).toFixed(1)}
        onChange={handlePointValueChange}
        type="number"
        className={cn("w-12 text-center border rounded-md p-1")}
      />
      <div
        className={cn(
          "group-hover:opacity-100 hover:cursor-pointer opacity-0 hover:bg-primary hover:text-white rounded-full transition-all p-1"
        )}
      >
        <Trash2Icon className={cn("size-4")} onClick={handleRemoveOption} />
      </div>
    </motion.div>
  );
}

export default function OptionList({ options }: { options: OptionType[] }) {
  return (
    <AnimatePresence key={"options"}>
      <div className={cn("space-y-2")}>
        {options
          .sort((a, b) => a.position! - b.position!)
          .map((option) => (
            <Option key={option.id} option={option} />
          ))}
      </div>
    </AnimatePresence>
  );
}
