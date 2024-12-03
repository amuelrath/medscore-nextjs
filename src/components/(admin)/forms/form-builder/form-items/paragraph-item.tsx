import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { motion } from 'framer-motion';

interface ParagraphItemProps {
  id: string;
}

export function ParagraphItem({ id }: ParagraphItemProps) {


  return (
    <motion.div layout="position" className="space-y-3 pb-6">
      <AutosizeTextarea
        className="text-sm"
        placeholder="Paragraph"
        variant="typography"
      />
    </motion.div>
  );
}
