"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteEvaluation } from "../../actions";
import {
  ArrowsUpFromLineIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
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

export function EvaluationMenu({ evaluationId }: { evaluationId: string }) {
  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "data-[state=open]:bg-slate-900 data-[state=open]:text-white w-6 rounded-full py-1 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
            )}
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href={`/secure/evaluations/${evaluationId}`}
                className={cn("w-full")}
              >
                <div
                  className={cn(
                    "w-full flex flex-row justify-between items-center"
                  )}
                >
                  Edit
                  <PencilIcon className="w-4" />
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div
                className={cn(
                  "w-full flex flex-row justify-between items-center"
                )}
              >
                Publish
                <ArrowsUpFromLineIcon className="w-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AlertDialogTrigger className="w-full">
                <div
                  className={cn(
                    "w-full flex flex-row justify-between items-center"
                  )}
                >
                  Delete
                  <Trash2Icon className={cn("w-4")} />
                </div>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className={cn("rounded-md")}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evaluation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irrevsible. All data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn("bg-slate-900 text-white")}
            onClick={() =>
              deleteEvaluation(evaluationId).then(() =>
                toast.success("Evaluation deleted.")
              )
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
