import { Badge } from "@/components/ui/badge";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";

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
    <div className={cn("w-[512px] items-center space-x-1")}>
      {tags.sort().map((tag) => (
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
      ))}
    </div>
  );
};
