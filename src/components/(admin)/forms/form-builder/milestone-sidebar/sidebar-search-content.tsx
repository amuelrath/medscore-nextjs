import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';
import { useRef, useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import FuzzySearch from 'fuzzy-search';
import { MilestoneCard } from '@/components/(admin)/forms/form-builder/milestone-sidebar/milestone-card';
import { ScientistIllustration } from '@/components/illustrations/scientist-illustration';

interface SearchContentProps {
  subcompetencies: SubcompetencyResult;
}

export function SearchContent({ subcompetencies }: SearchContentProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="pt-0.5 space-y-2 relative">
      <SearchInput
        ref={searchRef}
        size="sm"
        placeholder="Search Milestones..."
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      <div className="space-y-6 flex-col flex max-h-[430px] overflow-y-auto">
        {searchValue.length > 0 ? (
          subcompetencies.map((s) => {
            const searcher = new FuzzySearch(
              s.milestones,
              ['description', 'name'],
              {
                caseSensitive: false,
                sort: true,
              },
            );

            return searcher
              .search(searchValue)
              .map((m) => <MilestoneCard key={m.id} milestone={m} />);
          })
        ) : (
          <div className="flex flex-col flex-grow items-center justify-center ">
            <ScientistIllustration width={200} height={300} />
            <p className="font-semibold">No Milestones Found</p>
          </div>
        )}
      </div>
    </div>
  );
}