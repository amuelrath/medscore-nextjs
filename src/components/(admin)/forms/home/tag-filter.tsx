import { formTypeContent } from "@/components/(admin)/forms/home/create-form-dialog";
import { Badge } from "@/components/ui/badge";
import { TFormType } from "@/db/schema";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useRef } from "react";

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

  return (
    <div className="flex flex-row items-center space-x-2">
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
              variant="hide"
              onClick={() => handleTagClick(tag)}
              className={cn(
                "cursor-pointer h-10 rounded-md truncate border border-border font-normal ",
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
  );
};
