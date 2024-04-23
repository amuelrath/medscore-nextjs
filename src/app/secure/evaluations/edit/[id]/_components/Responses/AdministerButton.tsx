"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RocketIcon } from "lucide-react";
import * as Dialog from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import collectResponses from "../_actions/collectResponses";
import { useForm } from "react-hook-form";

export function AdministerButton() {
  const { getValues } = useForm();

  return (
    <Dialog.Dialog>
      <AdministerDialog evaluationName={"Shart Bucket"} />
      <Dialog.DialogTrigger>
        <Card
          aria-label="collect-responses"
          className={cn(
            "group hover:bg-accent-secondary hover:scale-105 col-span-1 h-32 hover:shadow-md bg-primary text-white transition-all flex justify-center items-center cursor-pointer"
          )}
        >
          <CardContent
            className={cn("p-2 flex flex-col space-y-2 items-center")}
          >
            <RocketIcon
              className={cn(
                "size-[4rem] group-hover:size-[5rem] align-middle transition-all"
              )}
            />
            <p
              className={cn(
                "group font-semibold group-hover:tracking-wider transition-all"
              )}
            >
              Administer Evaluation
            </p>
          </CardContent>
        </Card>
      </Dialog.DialogTrigger>
    </Dialog.Dialog>
  );
}

function AdministerDialog({ evaluationName }: { evaluationName: string }) {
  return (
    <Dialog.DialogPortal>
      <motion.div>
        <Dialog.DialogContent>
          <Dialog.DialogTitle>
            {`Administer "${evaluationName}"`}
            <Dialog.DialogDescription>
              Answer the following questions to collect responses for this
              evaluation.
            </Dialog.DialogDescription>
          </Dialog.DialogTitle>
          <hr />
          <form action="">
            <div className={cn("pb-2")}>
              <Label>Enter the length of time</Label>
              <Input />
              <Label>Enter the length of time</Label>
              <Input />
              <Label>Enter the length of time</Label>
              <Input />
            </div>
            <div className={cn("flex justify-center")}>
              <Button variant={"default"}>Collect Responses</Button>
            </div>
          </form>
        </Dialog.DialogContent>
      </motion.div>
    </Dialog.DialogPortal>
  );
}
