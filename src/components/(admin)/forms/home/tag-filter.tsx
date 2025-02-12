import { Button } from '@/components/ui/button';
import { TFormType } from '@/db/schema';
import { formTypeContent } from '@/lib/constants/forms';
import { cn } from '@/lib/helpers/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

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
  const handleTagClick = (tag: TFormType) => {
    if (selectedTag === tag) {
      onTagRemove();
    } else {
      onTagSelect(tag);
    }
  };

  return (
    <div className="flex flex-row w-[200px] items-center space-x-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {tags.sort().map((tag) => (
          <motion.div
            layout
            key={tag}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleTagClick(tag)}
              className={cn('cursor-pointer truncate min-h-7', {
                'border-neutral-300 text-foreground': selectedTag === tag,
                'text-foreground/50 hover:border-neutral-300  hover:text-foreground':
                  selectedTag !== tag,
              })}
            >
              {(() => {
                const Content = formTypeContent[tag];
                return <Content size={16} />;
              })()}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
