import React, { Children, isValidElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WaterfallAnimationProps {
  children: React.ReactNode;
  speed?: number;
}

const WaterfallAnimation: React.FC<WaterfallAnimationProps> = ({
  children,
  speed,
}) => {
  const animateChild = (child: React.ReactNode, index: number) => {
    if (isValidElement(child)) {
      return (
        <motion.div
          key={child.key || index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: speed ?? 0.2,
            delay: index * 0.1,
          }}
        >
          {child}
        </motion.div>
      );
    }
    return child;
  };

  return (
    <AnimatePresence>{Children.map(children, animateChild)}</AnimatePresence>
  );
};

export default WaterfallAnimation;
