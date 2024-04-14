"use client";
import { cn } from "@/lib/utils";
import {
  SettingsIcon,
  SaveAllIcon,
  ArrowsUpFromLineIcon,
  Loader2,
} from "lucide-react";
import { changeEvaluationTitle } from "../_actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientEvaluation } from "@/db/client-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
export default function EditorToolbar({
  evaluation,
}: {
  evaluation: ClientEvaluation;
}) {
  return (
    <div className={cn("flex flex-row space-x-2")}>
      <SettingsButton evaluation={evaluation} />
      <SaveButton />
      <PublishButton />
    </div>
  );
}

function PublishButton() {
  return (
    <Button variant={"icon"} size={"icon"}>
      <ArrowsUpFromLineIcon size={"1rem"} />
    </Button>
  );
}

function SaveButton() {
  return (
    <Button variant={"icon"} size={"icon"}>
      <SaveAllIcon size={"1rem"} />
    </Button>
  );
}

function SettingsButton({ evaluation }: { evaluation: ClientEvaluation }) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await changeEvaluationTitle(evaluation.id, data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"icon"} size={"icon"}>
          <SettingsIcon size={"1rem"} />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("rounded-md")}>
        <DialogTitle>Settings</DialogTitle>
        <hr />
        <form
          className={cn("space-y-4")}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input name="title" defaultValue={evaluation.title} />
          </div>
          <div className={cn("flex justify-center")}>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2
                  strokeWidth={2}
                  size="1rem"
                  className={cn("animate-spin text-notepad")}
                />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
