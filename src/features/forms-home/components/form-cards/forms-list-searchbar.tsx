import { Input } from '@/components/ui/input';

interface FormsListSearchbarProps {
  handleFilter: (term: string) => void;
}

export function FormsListSearchbar({ handleFilter }: FormsListSearchbarProps) {
  return (
    <Input
      size="xs"
      className="w-[300px]"
      placeholder="Search my forms..."
      onChange={(e) => handleFilter(e.target.value)}
    />
  );
}
