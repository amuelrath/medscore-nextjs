"use client";
import { ArrowsUpFromLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PublishButton() {
  return (
    <Button variant={"icon"} size={"icon"}>
      <ArrowsUpFromLineIcon size={"1rem"} />
    </Button>
  );
}
