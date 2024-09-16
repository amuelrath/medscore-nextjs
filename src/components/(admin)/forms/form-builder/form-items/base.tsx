import { CardContent } from '@/components/ui/card';
import { CopyIcon, GripVerticalIcon, XIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface BaseProps {
  children: ReactNode;
  onCopyClick: () => void;
  onDeleteClick: () => void;
  index: number;
  required?: boolean;
}

export function Base({
  onCopyClick,
  onDeleteClick,
  children,
  index,
  required,
}: BaseProps) {
  return (
    <div className="flex mb-4 bg-white flex-row rounded border shadow-sm">
      <div className="flex flex-col p-1 justify-start items-center">
        <GripVerticalIcon
          role="button"
          size={20}
          className="text-primary/40 hover:text-primary/70 transition-colors"
        />
      </div>
      <div className="space-y-2 flex-grow pr-7 pl-0.5">
        <div className="w-full h-6 flex flex-row justify-between">
          <div className="flex flex-row space-x-4">
            <span className="text-white select-none flex items-center justify-center text-sm w-8 rounded-b bg-primary/60">
              {index + 1}
            </span>
            {required && (
              <span className="mt-[3px] text-primary select-none">*</span>
            )}
          </div>
          <div className="flex text-center justify-center px-4 rounded-b bg-primary/60 space-x-4 items-center">
            <CopyIcon
              onClick={onCopyClick}
              role="button"
              size={13}
              className="text-white hover:text-accent transition-colors"
            />
            <XIcon
              onClick={onDeleteClick}
              role="button"
              size={16}
              className="text-white hover:text-destructive transition-colors"
            />
          </div>
        </div>
        <CardContent className="flex-grow pb-2 px-0">{children}</CardContent>
      </div>
    </div>
  );
}
