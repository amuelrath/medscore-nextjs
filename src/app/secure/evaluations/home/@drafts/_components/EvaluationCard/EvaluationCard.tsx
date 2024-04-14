"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClientEvaluation } from "@/db/client-types";
import { EditIcon, ArrowsUpFromLineIcon, Trash2 } from "lucide-react";
import { deleteEvaluation } from "../_actions";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";

export default function EvaluationCard({
  evaluation,
  index,
}: {
  evaluation: ClientEvaluation;
  index: number;
}) {
  function formatDate(date: Date): string {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // Get the difference in seconds

    if (diff < 300) {
      return "Just Now";
    } else if (diff < 86400) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 172800) {
      return "Yesterday";
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  function parseTitle(title: string) {
    if (title.length > 43) {
      return title.slice(0, 43) + "...";
    } else {
      return title;
    }
  }

  return (
    <motion.div
      layoutId={`evaluation-card-${evaluation.id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 * (index + 1) }}
    >
      <Card
        className={cn(
          "col-span-1 transition-all flex flex-col justify-between p-2 select-none"
        )}
      >
        <div className={cn("flex justify-between")}>
          <div>
            <h5 className={cn("text-md font-semibold m-0 p-0")}>
              {parseTitle(evaluation.title)}
            </h5>
            <p className={cn("text-sm text-gray-500 italic hover:underline")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {evaluation.programs?.name}
            </p>
          </div>
        </div>
        <div>
          <hr className={cn("mb-2")} />
          <div className={cn("flex flex-row justify-between items-center")}>
            <div className={cn("space-x-2 ")}>
              <EditButton evaluationId={evaluation.id} />
              <PublishButton evaluation={evaluation} />
              <DeleteButton evaluation={evaluation} />
            </div>
            <p className={cn("text-xs")}>
              Last Opened: {formatDate(evaluation.updatedAt)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function PublishButton({ evaluation }: { evaluation: ClientEvaluation }) {
  return (
    <Button size={"sm"}>
      <ArrowsUpFromLineIcon />
    </Button>
  );
}

function EditButton({ evaluationId }: { evaluationId: string }) {
  return (
    <Link
      href={`/secure/evaluations/edit/${evaluationId}`}
      className={cn("w-full")}
    >
      <Button variant={"accent-secondary"} size={"sm"} className={cn("w-24")}>
        <EditIcon />
      </Button>
    </Link>
  );
}

function DeleteButton({ evaluation }: { evaluation: ClientEvaluation }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete '{evaluation.title}' ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irrevsible. All data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() =>
            deleteEvaluation(evaluation.id).then(() =>
              toast.success("Evaluation deleted.")
            )
          }
        >
          Delete
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
