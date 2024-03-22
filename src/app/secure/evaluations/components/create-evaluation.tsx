"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { createEvaluation } from "../actions";

export const createEvaluationFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export default function CreateEvaluation() {
  const form = useForm<z.infer<typeof createEvaluationFormSchema>>({
    resolver: zodResolver(createEvaluationFormSchema),
  });

  const { handleSubmit, register } =
    useForm<z.infer<typeof createEvaluationFormSchema>>();

  return (
    <Drawer>
      <DrawerTrigger className="mt-2 text-white bg-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-900/80 transition-all">
        <PlusCircleIcon />
      </DrawerTrigger>
      <DrawerContent className="h-[75%]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">new evaluation</DrawerTitle>
          <p className="text-sm">
            enter evaluation details. you can always change them later.
          </p>
          <hr />
        </DrawerHeader>
        <form action={(data) => createEvaluation(data)}>
          <div className="px-8 space-y-2 h-full">
            <Input
              className="font-bold"
              placeholder="give your evaluation a title"
              {...register("title")}
            />
            <Textarea
              placeholder="what will this evaluation be testing?"
              {...register("description")}
            />
          </div>
          <DrawerFooter>
            <div className="flex flex-row justify-center">
              <DrawerClose
                role="button"
                type="submit"
                className="bg-slate-900 text-white px-2 py-1.5 rounded-md hover:bg-slate-900/80 transition-all"
              >
                create
              </DrawerClose>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

// todo PROGRAM SELECTOR
