import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
export default function LoadingSection() {
  return (
    <div className={cn("flex h-full flex-col items-center justify-center")}>
      <Loading />
    </div>
  );
}
