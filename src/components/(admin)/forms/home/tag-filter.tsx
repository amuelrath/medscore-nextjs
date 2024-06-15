import { Badge } from "@/components/ui/badge";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onTagRemove();
    } else {
      setSelectedTag(tag);
      onTagSelect(tag);
    }
  };

  return (
    <div className={cn("w-[512px] flex flex-row items-center space-x-1")}>
      <AnimatePresence mode={"popLayout"}>
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
              className={cn("cursor-pointer font-medium", {
                "opacity-100": selectedTag === tag,
                "opacity-60": selectedTag !== tag,
              })}
              key={tag}
              variant="default"
            >
              {tag}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};