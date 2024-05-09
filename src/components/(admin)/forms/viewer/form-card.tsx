"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TFormRelate } from "@/db/types";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import { DeleteFormDialog } from "@/components/(admin)/forms/dialogs/delete-evaluation-dialog";
// TODO Fix Hydration Error with rendering the title!
export function FormCard({
  form,
  index,
}: {
  form: TFormRelate;
  index: number;
}) {
  const router = useRouter();
  const handleNavigate = (href: string) => {
    router.push(href);
  };
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
          "group col-span-1 flex select-none flex-col justify-between p-2 transition-all hover:shadow-md",
        )}
      >
        <div className={cn("flex items-center justify-between")}>
          <div
            className={cn("flex flex-col items-start cursor-pointer")}
            onClick={() => handleNavigate(`/forms/${form.id}`)}
          >
            <div className={cn("text-md group m-0 p-0 font-semibold ")}>
              {parseTitle(form.title)}
            </div>
            <div className={cn("text-sm text-gray-500")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {form.programs?.name}
            </div>
          </div>
          <div
            className={cn(
              "group space-x-2 opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            <Button
              variant={"default"}
              size={"sm"}
              className={cn("w-28")}
              onClick={() => handleNavigate(`/forms/${form.id}`)}
            >
              <EditIcon />
            </Button>
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
