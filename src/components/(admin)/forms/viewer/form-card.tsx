import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FormResult } from "@/db/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import { DeleteFormDialog } from "@/components/(admin)/forms/dialogs/delete-evaluation-dialog";
import Link from "next/link";
// TODO Fix Hydration Error with rendering the title!

export function FormCard({ form, index }: { form: FormResult; index: number }) {
  function truncateTitle(title: string) {
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
          "group col-span-1 flex select-none flex-col justify-between p-2 transition-all hover:shadow-md",
        )}
      >
        <div className={cn("flex items-center justify-between")}>
          <Link
            href={`/forms/${form.id}`}
            className={cn("flex cursor-pointer flex-col items-start")}
          >
            <div className={cn("text-md group m-0 p-0 font-semibold ")}>
              {truncateTitle(form.title)}
            </div>
            <div className={cn("text-sm text-gray-500")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {form.programs?.name}
            </div>
          </Link>
          <div
            className={cn(
              "group space-x-2 opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            <Link href={`/forms/${form.id}`}>
              <Button
                role={"div"}
                variant={"default"}
                size={"sm"}
                className={cn("w-28")}
              >
                <EditIcon />
              </Button>
            </Link>
            <DeleteFormDialog form={form}>
              <Button variant={"destructive"} size={"sm"}>
                <Trash2Icon />
              </Button>
            </DeleteFormDialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
