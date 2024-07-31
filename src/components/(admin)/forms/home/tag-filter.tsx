import { Badge } from "@/components/ui/badge";
import React, { FC, useRef } from "react";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { TFormType } from "@/db/schema";
import { formTypeContent } from "@/components/(admin)/forms/home/create-form-dialog";

interface TagFilterProps {
  tags: TFormType[];
  onTagSelect: (tag: TFormType) => void;
  onTagRemove: () => void;
  selectedTag: TFormType | null;
}

export const TagFilter: FC<TagFilterProps> = ({
  tags,
  onTagSelect,
  onTagRemove,
  selectedTag,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleTagClick = (tag: TFormType) => {
    if (selectedTag === tag) {
      onTagRemove();
    } else {
      onTagSelect(tag);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (viewport) {
      event.preventDefault();
      viewport.scrollLeft += event.deltaY;
    }
  };

  return (
    <ScrollArea.Root className="w-full max-w-[300px] overflow-hidden">
      <ScrollArea.Viewport
        ref={viewportRef}
        className="h-full w-full"
        onWheel={handleWheel}
      >
        <div className="flex flex-row items-center space-x-1">
          <AnimatePresence mode={"popLayout"} initial={false}>
            {tags.map((tag) => (
              <motion.div
                layout
                key={tag}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                <Badge
                  variant="hide"
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    "cursor-pointer truncate border border-neutral-200 font-normal ",
                    {
                      "border-neutral-300 text-foreground": selectedTag === tag,
                      "text-foreground/50 hover:border-neutral-300  hover:text-foreground":
                        selectedTag !== tag,
                    },
                  )}
                >
                  {(() => {
                    const Content = formTypeContent[tag];
                    return <Content size={16} />;
                  })()}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="duration-[160ms] data-[orientation=horizontal] flex touch-none select-none bg-transparent transition-colors ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      ></ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-transparent" />
    </ScrollArea.Root>
  );
};

const tagText = {
  OSCE: "OSCE",
  DIRECT_OBSERVATION: "Direct Observation",
  SURVEY: "Survey",
  QUIZ: "Quiz",
};
