'use client'
import { motion } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { FC } from "react";

interface AddQuestionButtonProps {
  onClick: () => void;
}

export const AddQuestionButton: FC<AddQuestionButtonProps> = ({ onClick }) => {
  return (
    <motion.div layout className="mt-4 flex justify-center">
      <motion.div
        layoutId="add-question"
        className="cursor-pointer rounded-full p-1 transition-all hover:bg-primary hover:text-white"
        onClick={onClick}
      >
        <PlusCircleIcon />
      </motion.div>
    </motion.div>
  );
};

