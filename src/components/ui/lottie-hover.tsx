"use client";

import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";

export function LottieHover({ src }: { src: any }) {
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
    <Lottie
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animationData={src}
      lottieRef={ref}
      loop={true}
      autoplay={true}
    />
  );
}
