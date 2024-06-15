"use client";

import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";

const lottieHoverVariants = cva("cursor-pointer", {
  variants: {
    size: {
      xs: "size-5",
      sm: "size-12",
      md: "size-20",
      lg: "w-36 h-36",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LottieHoverProps extends VariantProps<typeof lottieHoverVariants> {
  loop?: boolean;
  src: any;
}

export function LottieHover({ src, size, loop=true }: LottieHoverProps) {
  const ref = useRef<any>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) {
      ref.current?.play();
    } else {
      ref.current?.stop();
    }
  }, [hover]);

  return (
    <div className={lottieHoverVariants({ size })}>
      <Lottie
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        animationData={src}
        lottieRef={ref}
        loop={loop}
        autoplay={true}
      />
    </div>
  );
}
