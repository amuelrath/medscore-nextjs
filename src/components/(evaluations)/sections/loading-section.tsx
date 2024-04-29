import Loading from "@/components/ui/loading";
import Section from "@/components/ui/section";
import { cn } from "@/lib/utils";
export default function LoadingSection() {
  return (
    <Section>
      <div className={cn("h-full flex flex-col justify-center items-center")}>
        <Loading />
      </div>
    </Section>
  );
}
