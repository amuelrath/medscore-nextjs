"use client";
import type { FormTag } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createTag } from "@/server/actions/forms/create-tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { v4 } from "uuid";
import { m, AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { deleteTag } from "@/server/actions/forms/delete-tag";

export type ColorOption =
  | "black"
  | "white"
  | "red"
  | "yellow"
  | "green"
  | "blue";

export type Color = { bg: string; variant: string; color: ColorOption };
const colors: Color[] = [
  {
    bg: "bg-primary",
    variant: "default",
    color: "black",
  },
  {
    bg: "border border-neutral-300 bg-background",
    variant: "white",
    color: "white",
  },
  {
    bg: "bg-destructive",
    variant: "destructive",
    color: "red",
  },
  {
    bg: "bg-yellow-500",
    variant: "yellow",
    color: "yellow",
  },
  {
    bg: "bg-emerald-600",
    variant: "green",
    color: "green",
  },
  {
    bg: "bg-accent",
    variant: "accent",
    color: "blue",
  },
];
const ZTagFormSchema = z.object({
  tag: z.string().min(1, "Tag name is required"),
  color: z.enum(["black", "white", "red", "yellow", "green", "blue"]),
});

type TagFormInput = z.infer<typeof ZTagFormSchema>;

export function FormTags({
  tags,
  formId,
}: {
  tags: Omit<FormTag, "formId">[] | undefined;
  formId: string;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFormInput>({
    resolver: zodResolver(ZTagFormSchema),
  });

  const queryClient = useQueryClient();
  const addTagMutation = useMutation({
    mutationFn: createTag,
    onMutate: (data) => {
      queryClient.setQueryData<FormLiteResult[]>(
        ["forms", "lite"],
        (oldData) => {
          if (oldData) {
            return oldData.map((form) => {
              if (form.id === formId) {
                return {
                  ...form,
                  tags: [
                    ...(form.tags || []),
                    {
                      id: data.id,
                      tag: data.tag,
                      color: data.color,
                      bg: colors.find((c) => data.color === c.color)!.bg,
                    },
                  ],
                };
              }
              return form;
            });
          }
          return oldData;
        },
      );
      reset();
    },
  });

  const addTag = (data: TagFormInput) => {
    const id = v4(); // Generate a new UUID for the tag

    addTagMutation.mutate({
      id,
      tag: data.tag,
      color: data.color,
      formId,
    });
  };

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onMutate: (data) => {
      queryClient.setQueryData<FormLiteResult[]>(
        ["forms", "lite"],
        (oldData) => {
          if (oldData) {
            return oldData.map((form) => {
              if (form.id === formId) {
                return {
                  ...form,
                  tags: [
                    ...(form.tags.filter((t) => t.id !== data.tagId) || []),
                  ],
                };
              }
              return form;
            });
          }
          return oldData;
        },
      );
    },
  });
  const removeTag = (tagId: string) => {
    deleteTagMutation.mutate({ tagId });
  };

  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);
  const handleMouseEnter = (tagId: string) => {
    setHoveredTagId(tagId);
  };

  const handleMouseLeave = () => {
    setHoveredTagId(null);
  };

  return (
    <>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {tags?.map((tag) => (
            <m.div key={tag.id} layout={"position"} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2}}>
              <Badge
                // @ts-ignore
                variant={cn(colors.find((c) => c.color === tag.color)!.variant)}
                className={cn(`group relative cursor-pointer`)}
                size={"xs"}
                onMouseEnter={() => handleMouseEnter(tag.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => removeTag(tag.id)}
              >
                <span
                  className={cn(
                    "origin-center transition-all duration-200",
                    hoveredTagId === tag.id
                      ? "scale-x-0 opacity-0"
                      : "scale-x-100 opacity-100",
                  )}
                >
                  {tag.tag}
                </span>
                <TrashIcon
                  size={12}
                  className={cn(
                    `absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200`,
                    hoveredTagId === tag.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </Badge>
            </m.div>
          ))}
        </AnimatePresence>
      </LazyMotion>

      <Popover>
        <PopoverTrigger>
          <Badge
            size={"md"}
            variant={"opaque"}
            className={cn(
              "group cursor-pointer border opacity-0 transition-all group-hover:opacity-100",
            )}
          >
            <PlusIcon size={14} />
          </Badge>
        </PopoverTrigger>
        <PopoverContent className={cn("flex w-96 flex-col ")}>
          <form className="space-y-3" onSubmit={handleSubmit(addTag)}>
            <Controller
              name="color"
              defaultValue={"black"}
              control={control}
              render={({ field }) => (
                <TagColorSelector onChange={field.onChange} />
              )}
            />
            <div className={cn("flex w-full flex-row items-center space-x-4")}>
              <Input placeholder={"Name..."} {...register(`tag`)} />
              <Button>Add Tag</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
}

function TagColorSelector({
  onChange,
}: {
  onChange: (color: ColorOption) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>("black");

  const handleClick = (color: ColorOption) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <div className="flex flex-row space-x-2">
      {colors.map((color) => (
        <div
          key={color.color}
          onClick={() => handleClick(color.color)}
          className={cn(
            color.bg,
            "size-5 cursor-pointer rounded-full transition-all",
            selectedColor === color.color &&
              "scale-110 ring-2 ring-primary ring-offset-1",
          )}
        />
      ))}
    </div>
  );
}
