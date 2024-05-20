import React, { Children, isValidElement, useRef } from "react";
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion";

interface WaterfallAnimationProps {
  children: React.ReactNode;
  speed?: number;
}

const WaterfallAnimation: React.FC<WaterfallAnimationProps> = ({
  children,
  speed,
}) => {
  const hasAnimatedRef = useRef(false);

  const animateChild = (child: React.ReactNode, index: number) => {
    if (isValidElement(child)) {
      return (
        <m.div
          key={child.key || index}
          initial={{ opacity: 0 }}
          animate={hasAnimatedRef.current ? { opacity: 1 } : { opacity: 1 }}
          transition={{
            duration: speed ?? 0.2,
            delay: hasAnimatedRef.current ? 0 : index * 0.1,
          }}
        >
          {child}
        </m.div>
      );
    }
    return child;
  };

  return (
    <LazyMotion strict features={domAnimation}>
      <AnimatePresence onExitComplete={() => (hasAnimatedRef.current = true)}>
        {Children.map(children, animateChild)}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default WaterfallAnimation;
