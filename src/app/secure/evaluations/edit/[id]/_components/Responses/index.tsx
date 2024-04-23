import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowDown01Icon,
  ArrowUp01,
  ArrowUp01Icon,
  ArrowUp10Icon,
  FilterIcon,
  PowerIcon,
  SpaceIcon,
  SquarePlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdministerButton } from "./AdministerButton";

export default function Responses() {
  return (
    <div
      className={cn("grid xl:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4")}
    >
      <AdministerButton />
      <Card
        aria-label="statistics"
        className={cn("xl:col-span-3 col-span-1 h-32")}
      >
        <CardContent></CardContent>
      </Card>
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
