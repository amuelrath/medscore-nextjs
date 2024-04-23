"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClientForm } from "@/db/client-types";
import React from "react";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function EvaluationCard({
  form,
  index,
}: {
  form: ClientForm;
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
      layoutId={`evaluation-card-${form.id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 * (index + 1) }}
    >
      <Card
        className={cn(
          "group hover:shadow-md col-span-1 transition-all flex flex-col justify-between p-2 select-none"
        )}
      >
        <div className={cn("flex justify-between items-center")}>
          <Link href={`/secure/evaluations/edit/${form.id}`}>
            <div>
              <h5 className={cn("group text-md font-semibold m-0 p-0 ")}>
                {parseTitle(form.title)}
              </h5>
              <p className={cn("text-sm text-gray-500")}>
                {/* todo turn this into a link that allows the user to view that program */}
                {form.programs?.name}
              </p>
            </div>
          </Link>
          <div
            className={cn(
              "group group-hover:opacity-100 opacity-0 space-x-2 transition-opacity"
            )}
          >
            <EditButton evaluationId={form.id} />
            <DeleteButton form={form} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
