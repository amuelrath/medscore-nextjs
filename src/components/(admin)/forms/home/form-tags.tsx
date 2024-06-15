"use client";
import type { FormTag } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
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

export type Color = {
  bg: string;
  variant: string;
  ring: string;
};
export const tagColors: Color[] = [
  {
    bg: "bg-primary",
    variant: "default",
    ring: "ring-primary",
  },
  {
    bg: "border border-neutral-300 bg-background",
    variant: "white",
    ring: "ring-slate-300",
  },
  {
    bg: "bg-destructive",
    variant: "destructive",
    ring: "ring-destructive",
  },
  {
    bg: "bg-yellow-500",
    variant: "yellow",
    ring: "ring-yellow-500",
  },
  {
    bg: "bg-emerald-600",
    variant: "green",
    ring: "ring-emerald-600",
  },
  {
    bg: "bg-accent",
    variant: "accent",
    ring: "ring-accent",
  },
];

export type ColorOption = (typeof tagColors)[number]["variant"];

const ZTagFormSchema = z.object({
  tag: z.string().min(1, "Tag name is required"),
  variant: z.enum([
    "default",
    "white",
    "destructive",
    "yellow",
    "green",
    "accent",
  ]),
});

type TagFormInput = z.infer<typeof ZTagFormSchema>;

export function FormTags({
  tags,
  formId,
}: {
  tags: Omit<FormTag, "formId">[] | undefined;
  formId: string;
}) {
  const { reset, control, register, handleSubmit } = useForm<TagFormInput>({
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
                      variant: data.variant,
                      bg: tagColors.find((c) => data.variant === c.variant)!
                        .variant,
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
      variant: data.variant,
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

  return (
    <>
          {tags?.map((tag) => {
            return <FormTag key={tag.id} tag={tag} removeTag={removeTag} />;
          })}

      <Popover>
        <PopoverTrigger>
          <Badge
            size={"md"}
            variant={"opaque"}
            className={cn(
              "group mt-0.5 cursor-pointer border opacity-0 transition-all focus:grayscale group-hover:opacity-100",
            )}
          >
            <PlusIcon size={15} />
          </Badge>
        </PopoverTrigger>
        <PopoverContent className={cn("flex w-96 flex-col ")}>
          <form className="space-y-3" onSubmit={handleSubmit(addTag)}>
            <Controller
              name="variant"
              defaultValue={"default"}
              control={control}
              render={({ field }) => (
                <TagColorSelector
                  colors={tagColors}
                  onChange={field.onChange}
                />
              )}
            />
            <div className={cn("flex w-full flex-row items-center space-x-4")}>
              <Input placeholder={"Tag Description..."} {...register(`tag`)} />
              <Button>Add Tag</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
}

function FormTag({
  tag,
  removeTag,
}: {
  tag: Omit<FormTag, "formId">;
  removeTag: (tagId: string) => void;
}) {
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);
  const handleMouseEnter = (tagId: string) => {
    setHoveredTagId(tagId);
  };

  const handleMouseLeave = () => {
    setHoveredTagId(null);
  };
  return (
    <m.div
      key={tag.id}
      layout={"position"}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Badge
        // @ts-ignore
        variant={tag.variant}
        className={cn(`group font-medium relative cursor-pointer`)}
        size={"xs"}
        onMouseEnter={() => handleMouseEnter(tag.id)}
        onMouseLeave={handleMouseLeave}
        onClick={() => removeTag(tag.id)}
      >
        <span
          className={cn(
            "origin-center transition-all duration-200 ease-in-out",
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
  );
}

function TagColorSelector({
  colors,
  onChange,
}: {
  colors: Color[];
  onChange: (color: ColorOption) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>("default");

  const handleClick = (color: ColorOption) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <div className="flex flex-row justify-center space-x-2">
      {colors.map((color) => (
        <div
          key={color.variant}
          onClick={() => handleClick(color.variant)}
          className={cn(
            color.bg,
            "size-6 cursor-pointer rounded-full transition-all",
            selectedColor === color.variant &&
              `scale-110 ring-2 ${color.ring} ring-offset-1`,
          )}
        />
      ))}
    </div>
  );
}
