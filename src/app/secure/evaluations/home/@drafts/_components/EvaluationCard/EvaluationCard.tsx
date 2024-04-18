"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClientEvaluation, EvaluationFormData } from "@/db/client-types";
import { EditIcon, ArrowsUpFromLineIcon, Trash2, Loader2 } from "lucide-react";
import { deleteEvaluation } from "../_actions";
import React, { useState } from "react";
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
import { publishEvaluation } from "@/app/secure/evaluations/edit/[id]/_components/_actions";
import { boolean } from "drizzle-orm/mysql-core";

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

    if (diff < 60) {
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
          <p className={cn("text-xs")}>
            Last Opened: {formatDate(evaluation.lastOpenedAt)}
          </p>
        </div>
        <div>
          <hr className={cn("mb-2")} />
          <div className={cn("flex flex-row justify-end items-center")}>
            <div className={cn("space-x-2 ")}>
              <EditButton evaluationId={evaluation.id} />
              <PublishButton evaluation={evaluation} />
              <DeleteButton evaluation={evaluation} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// this is essentially a duplicate PublishButton but it gets data differently.
// i feel gross having this here but i don't know how to refactor it in a way that won't take forever
function PublishButton({ evaluation }: { evaluation: ClientEvaluation }) {
  const asFormData = morphClientEvaluationToFormData(evaluation);
  const [loading, setLoading] = useState<boolean>(false);
  const handlePublish = () => {
    if (!evaluation.published) {
      setLoading(true);
      publishEvaluation(asFormData)
        .then(() => {
          setLoading(false);
          toast.success(`Successfully published '${evaluation.title}'`);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      toast.error(
        "You cannot publish an evaluation that has already been published."
      );
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant={"notepad"}>
          <ArrowsUpFromLineIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("text-xl")}>
            Publishing '{evaluation.title}'
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer be able to make changes to this evaluation. Are
            you sure you wish to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handlePublish}>
          {loading ? (
            <Loader2
              strokeWidth={2}
              size="1rem"
              className={cn("animate-spin text-notepad")}
            />
          ) : (
            "Publish"
          )}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditButton({ evaluationId }: { evaluationId: string }) {
  return (
    <Link
      href={`/secure/evaluations/edit/${evaluationId}`}
      className={cn("w-full")}
    >
      <Button variant={"default"} size={"sm"} className={cn("w-28")}>
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

function morphClientEvaluationToFormData(
  clientEvaluation: ClientEvaluation
): EvaluationFormData {
  const evaluation: EvaluationFormData = {
    id: clientEvaluation.id as string,
    title: clientEvaluation.title as string,
    published: clientEvaluation.published as boolean,
    programId: clientEvaluation.programId as string,
    questions: clientEvaluation.questions.map((question) => ({
      id: question.id as string,
      position: question.position as number,
      text: question.text as string,
      feedback: question.feedback as boolean,
      milestoneIds: question.milestones.map((m) => m.milestoneId) as string[],
      options: question.options.map((option) => ({
        id: option.id as string,
        position: option.position as number,
        text: option.text as string,
        pointValue: Number(option.pointValue),
      })),
    })),
  };

  return evaluation;
}
