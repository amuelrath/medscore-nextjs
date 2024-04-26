import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown01Icon, ArrowUp01Icon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdministerButton } from "@/components/(evaluations)/responses/administer-button";
import { AnalysisButton } from "@/components/(evaluations)/responses/analysis-button";
import { ReportButton } from "@/components/(evaluations)/responses/reports-button";
export default function Responses() {
  return (
    <div className={cn("")}>
      <div className={cn("flex flex-row space-x-4")}>
        <div className={cn("flex w-max space-x-2 py-6")}>
          <AdministerButton />
          <AnalysisButton />
          <ReportButton />
        </div>
      </div>

      <div className={cn("xl:col-span-4 sm:col-span-2 col-span-1 space-y-2")}>
        <div className={cn("flex flex-row items-center justify-between")}>
          <h3 className={cn("font-semibold text-lg")}>Recent Responses</h3>
          <div className={cn("flex flex-row space-x-2 items-center")}>
            <Input
              placeholder="Search Responses..."
              className={cn("bg-white")}
            />
            <div className={cn("flex")}>
              <Button variant={"icon"} size="icon">
                <FilterIcon />
              </Button>
              <Button variant={"icon"} size="icon">
                <ArrowUp01Icon />
              </Button>
              <Button variant={"icon"} size="icon">
                <ArrowDown01Icon />
              </Button>
            </div>
          </div>
        </div>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
        <Card className={cn("w-full h-14")}></Card>
      </div>
    </div>
  );
}
