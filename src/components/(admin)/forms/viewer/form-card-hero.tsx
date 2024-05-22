"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import DOCUMENT_ICON_2 from "public/icons/wired-flat-60-documents.json";
import { useRef, useState, useEffect } from "react";

export function FormCardHero() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (isHovering) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isHovering]);

  return (
    <Card
      className={cn(
        "flex flex-col items-center px-4 pb-4 pt-2 transition-all hover:scale-105",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Lottie
        animationData={DOCUMENT_ICON_2}
        lottieRef={lottieRef}
        style={{ width: "120px", height: "120px" }}
      />
      <CardTitle className={cn("text-sm")}>Untitled Evaluation</CardTitle>
      <CardDescription className={cn("text-xs")}>
        Family Medicine Residency
      </CardDescription>
    </Card>
  );
}
