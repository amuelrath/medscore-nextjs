import Section from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
export default function LoadingDrafts() {
  return (
    <Section>
      <div className={cn("h-full flex flex-col justify-center items-center")}>
        <Loader2Icon
          strokeWidth={2}
          size="4rem"
          className={cn("animate-spin text-primary")}
        />
      </div>
    </Section>
  );
}
