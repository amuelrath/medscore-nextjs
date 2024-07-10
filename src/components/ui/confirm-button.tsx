"use client";
import { useState, useEffect, useRef, FC } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";

interface TwoStageConfirmButtonProps extends ButtonProps {
  onConfirm: () => void;
  initialText: string;
  confirmText: string;
  timeout?: number;
  progressColor?: string;
}

const TwoStageConfirmButton: FC<TwoStageConfirmButtonProps> = ({
  onConfirm,
  initialText,
  confirmText,
  timeout = 2000,
  progressColor = "bg-red-500",
  className,
  ...props
}) => {
  const [stage, setStage] = useState<0 | 1>(0);
  const [progress, setProgress] = useState<number>(100);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (stage === 1) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsedTime = Date.now() - (startTimeRef.current || 0);
        const remainingProgress = Math.max(
          0,
          100 - (elapsedTime / timeout) * 100,
        );

        setProgress(remainingProgress);

        if (remainingProgress === 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStage(0);
        }
      }, 16); // Run approximately 60 times per second for smooth animation
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, timeout]);

  const handleClick = () => {
    if (stage === 0) {
      setStage(1);
    } else {
      onConfirm();
      setStage(0);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden",
        stage === 1 ? `${progressColor}/10 hover:bg-red-600` : "",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">
        {stage === 0 ? initialText : confirmText}
      </span>
      {stage === 1 && (
        <>
          <div
            className={cn(
              "absolute inset-0 h-full",
              progressColor,
            )}
            style={{
              width: `${progress}%`,
              transition: "width 16ms linear",
            }}
          />
          <div
            className={cn(
              "absolute inset-0 h-full opacity-50",
              progressColor,
            )}
            style={{
              width: `${progress}%`,
              transition: "width 16ms linear",
            }}
          />
        </>
      )}
    </Button>
  );
};

export default TwoStageConfirmButton;
