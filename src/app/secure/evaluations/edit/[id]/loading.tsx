import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
export default function LoadingEditorV2() {
  return (
    <div className={cn("h-full flex flex-col justify-center items-center")}>
      <Loader2Icon
        strokeWidth={2}
        size="4rem"
        className={cn("animate-spin text-primary")}
      />
    </div>
  );
}
