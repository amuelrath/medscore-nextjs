import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';

interface SearchInputProps extends InputProps {}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { size = 'xs', placeholder = 'Search results...', className, ...props },
    ref,
  ) => (
      <div className="relative border-b">
        <SearchIcon className="absolute left-2 top-2.5 size-3 opacity-50" />
          <Input
          {...props}
          ref={ref}
          size={size}
          placeholder={placeholder}
          variant="transparent"
          className={cn('pl-8 font-light', className)}
        />
      </div>
    ),
);

SearchInput.displayName = 'SearchInput';
