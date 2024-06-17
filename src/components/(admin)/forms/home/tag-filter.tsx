import { Badge } from "@/components/ui/badge";
import { FC, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface TagFilterProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: () => void;
}

export const TagFilter: FC<TagFilterProps> = ({
  tags,
  onTagSelect,
  onTagRemove,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onTagRemove();
    } else {
      setSelectedTag(tag);
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
            {tags.sort().map((tag) => (
              <motion.div
                layout
                key={tag}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                <Badge
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    "cursor-pointer truncate bg-blue-900 font-medium text-blue-950 text-opacity-50 backdrop-blur-2xl hover:bg-blue-900/20",
                    {
                      "bg-opacity-25": selectedTag === tag,
                      "bg-opacity-5": selectedTag !== tag,
                    },
                  )}
                  key={tag}
                  variant="default"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="duration-[160ms] flex touch-none select-none bg-transparent transition-colors ease-out data-[orientation=horizontal] data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      ></ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-transparent" />
    </ScrollArea.Root>
  );
};
