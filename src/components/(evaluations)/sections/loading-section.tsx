import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
export default function LoadingSection() {
  return (
    <div className={cn("h-full flex flex-col justify-center items-center")}>
      <Loading />
    </div>
  );
}
