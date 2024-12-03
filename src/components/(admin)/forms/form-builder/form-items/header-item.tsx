import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { motion } from 'framer-motion';

interface HeaderItemProps {
  id: string;
}

export function HeaderItem({ id }: HeaderItemProps) {
  return (
    <motion.div layout="position" className="space-y-3 pb-6">
      <AutosizeTextarea
        placeholder="Heading"
        className="text-md font-semibold"
        variant="typography"
      />
    </motion.div>
  );
}
