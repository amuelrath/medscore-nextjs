import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import DOCUMENT_ICON_2 from "public/icons/wired-flat-60-documents.json";
import { useRef, useState, useEffect } from "react";

// this card should be prominent
export function FormCardHero() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const lottieRef = useRef<Player>(null);

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
        "px-4 pt-2 pb-4 flex flex-col items-center hover:scale-105 transition-all"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Player
        src={DOCUMENT_ICON_2}
        ref={lottieRef}
        style={{ width: "120px", height: "120px" }}
      />
      <CardTitle className={cn("text-sm")}>Shart Bucket</CardTitle>
      <CardDescription className={cn("text-xs")}>Sharter</CardDescription>
    </Card>
  );
}
