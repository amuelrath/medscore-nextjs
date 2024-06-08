import React, { Children, isValidElement, useRef } from "react";
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion";

interface WaterfallAnimationProps {
  children: React.ReactNode;
  speed?: number;
  noExit?: boolean;
}

const WaterfallAnimation: React.FC<WaterfallAnimationProps> = ({
  children,
  speed,
  noExit,
}) => {
  const hasAnimatedRef = useRef(false);

  const animateChild = (child: React.ReactNode, index: number) => {
    if (isValidElement(child)) {
      return (
        <m.div
          key={child.key || index}
          layoutId={child.key || index.toString()}
          initial={{ opacity: 0, y: 20 }}
          exit={
            noExit
              ? { opacity: 0 }
              : { opacity: 0, y: -20, transition: { duration: 0.2 } }
          }
          animate={
            hasAnimatedRef.current ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }
          }
          transition={{
            duration: speed ?? 0.2,
            delay: hasAnimatedRef.current ? 0 : index * 0.1,
          }}
          layout
        >
          {child}
        </m.div>
      );
    }
    return child;
  };

  return (
    <LazyMotion strict features={domAnimation}>
      <AnimatePresence
        onExitComplete={() => (hasAnimatedRef.current = !!noExit)}
      >
        {Children.map(children, animateChild)}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default WaterfallAnimation;
