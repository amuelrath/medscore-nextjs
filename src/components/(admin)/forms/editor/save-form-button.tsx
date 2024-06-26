import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import CLOUD_LOADING_LOOP from "public/icons/system-regular-84-cloud-black.json";
import CLOUD_DONE from "public/icons/system-regular-128-cloud-done-black.json";
import { cn } from "@/lib/utils";

export function SaveFormButton({ isSaving }: { isSaving: boolean }) {

  return (
    <Button
      type="button"
      variant={"icon"}
      className={cn("text-primary")}
      size={"icon"}

    >
      {isSaving ? (
        <Lottie
          animationData={CLOUD_LOADING_LOOP}
          loop
          autoplay
          style={{ width: 18, height: 18 }}
        />
      ) : (
        <Lottie
          animationData={CLOUD_DONE}
          loop={false}
          autoplay
          style={{ width: 18, height: 18 }}
        />
      )}
    </Button>
  );
}