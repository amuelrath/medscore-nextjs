"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createEvaluation } from "../actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateEvaluation() {
  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          "text-primary bg-white px-2 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
        )}
      >
        <PlusCircleIcon />
      </DrawerTrigger>
      <DrawerContent className={cn("h-[75%]")}>
        <DrawerHeader>
          <DrawerTitle className="text-2xl">new evaluation</DrawerTitle>
          <p className={cn("text-sm")}>
            enter evaluation details. you can always change them later.
          </p>
          <hr />
        </DrawerHeader>
        <form
          action={(data) =>
            createEvaluation(data).then(() =>
              toast.success("Evaluation created.")
            )
          }
        >
          <div className={cn("px-8 space-y-2 h-full")}>
            <Input
              name="title"
              className="font-bold"
              placeholder="give your evaluation a title"
            />
            <Textarea
              name="description"
              placeholder="provide a brief description?"
            />
            <h1>add program select here!</h1>
          </div>
          <DrawerFooter>
            <div className={cn("flex flex-row justify-center")}>
              <DrawerClose
                role="button"
                type="submit"
                className={cn(
                  "bg-slate-900 text-white px-2 py-1.5 rounded-md hover:bg-slate-900/80 transition-all"
                )}
              >
                create
              </DrawerClose>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

// todo PROGRAM SELECTOR
