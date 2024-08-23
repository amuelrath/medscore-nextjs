'use client';

import { cva, VariantProps } from 'class-variance-authority';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';

const lottieHoverVariants = cva('cursor-pointer', {
  variants: {
    size: {
      xs: 'size-5',
      sm: 'size-8',
      md: 'size-12',
      lg: 'w-24 h-24',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface LottieHoverProps extends VariantProps<typeof lottieHoverVariants> {
  loop?: boolean;
  src: any;
  isHovering?: boolean;
  inSpeed?: number;
  outSpeed?: number;
}

export function LottieHover({
  isHovering,
  src,
  size,
  loop = false,
  inSpeed = 1,
  outSpeed = 1.5,
}: LottieHoverProps) {
  const ref = useRef<any>(null);
  const [internalHover, setInternalHover] = useState(false);

  const hover = isHovering !== undefined ? isHovering : internalHover;

  useEffect(() => {
    if (hover) {
      ref.current?.setDirection(1);
      ref.current?.setSpeed(inSpeed);
      ref.current?.play();
    } else {
      ref.current?.setDirection(-1);
      ref.current?.setSpeed(outSpeed);
      ref.current?.play();
      const stopAnimation = () => {
        if (ref.current?.currentFrame === 0) {
          ref.current?.stop();
        } else {
          requestAnimationFrame(stopAnimation);
        }
      };
      requestAnimationFrame(stopAnimation);
    }
  }, [hover, inSpeed, outSpeed]);

  return (
    <div className={lottieHoverVariants({ size })}>
      <Lottie
        onMouseEnter={() => setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
        animationData={src}
        lottieRef={ref}
        loop={loop}
        autoplay
      />
    </div>
  );
}
