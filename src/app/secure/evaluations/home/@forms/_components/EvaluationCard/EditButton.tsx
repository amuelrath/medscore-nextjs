"use client";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EditButton({ evaluationId }: { evaluationId: string }) {
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
