import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown01Icon, ArrowUp01Icon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisButton } from "@/components/(evaluations)/responses/analysis-button";
import { ReportButton } from "@/components/(evaluations)/responses/reports-button";
import AdministerDialog from "../dialogs/administer-form-dialog";
export default function Responses() {
  return (
    <div className={cn("")}>
      <div className={cn("flex flex-row space-x-4")}>
        <div className={cn("flex w-max space-x-2 py-6")}>
          <AdministerDialog />
          <AnalysisButton />
          <ReportButton />
        </div>
      </div>

      <div className={cn("xl:col-span-4 col-span-1 space-y-2 sm:col-span-2")}>
        <div className={cn("flex flex-row items-center justify-between")}>
          <h3 className={cn("text-lg font-semibold")}>Recent Responses</h3>
          <div className={cn("flex flex-row items-center space-x-2")}>
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
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
        <Card className={cn("h-14 w-full")}></Card>
      </div>
    </div>
  );
}
