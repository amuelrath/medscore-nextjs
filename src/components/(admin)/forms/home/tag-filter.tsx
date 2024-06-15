import { Badge } from "@/components/ui/badge";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      onTagRemove();
    } else {
      setSelectedTags([...selectedTags, tag]);
      onTagSelect(tag);
    }
  };

  return (
      <div className={cn("space-x-1 items-center w-[512px]")} >
      {tags.sort().map((tag) => (
        <Badge
          onClick={() => handleTagClick(tag)}
          className={`cursor-pointer font-medium ${
            selectedTags.includes(tag) ? "opacity-100" : "opacity-60"
          }`}
          key={tag}
          variant="default"
        >
          {tag}
        </Badge>
      ))}
      </div>
  );
};
