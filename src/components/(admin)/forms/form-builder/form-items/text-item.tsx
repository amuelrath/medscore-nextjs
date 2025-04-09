import { useFormItemConfig } from '@/components/(admin)/forms/form-builder/hooks/use-form-item-config';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

type TextItemType = 'HEADER' | 'PARAGRAPH';

interface UseTextItemProps {
  id: string;
  type: TextItemType;
}

export function useTextItem({ id, type }: UseTextItemProps) {
  const { config, updateConfig } = useFormItemConfig({ id, type });

  const handleTextChange = useCallback(
    (text: string) => {
      updateConfig('text', text);
    },
    [updateConfig],
  );

  return {
    config,
    handleTextChange,
  } as const;
}

interface TextContentProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  variant: 'header' | 'paragraph';
}

function TextContent({
  value,
  onChange,
  placeholder,
  variant,
}: TextContentProps) {
  const className = variant === 'header' ? 'text-2xl font-semibold' : 'text-sm';

  return (
    <AutosizeTextarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      variant="typography"
    />
  );
}

interface TextItemProps {
  id: string;
  type: 'HEADER' | 'PARAGRAPH';
}

function TextItem({ id, type }: TextItemProps) {
  const { config, handleTextChange } = useTextItem({ id, type });

  const placeholder = type === 'HEADER' ? 'Heading' : 'Paragraph';
  const variant = type === 'HEADER' ? 'header' : 'paragraph';

  return (
    <motion.div
      key={id}
      layoutId={id}
      layout="position"
      transition={{ duration: 0.02}}
      className="space-y-3 pb-6"
    >
      <TextContent
        value={config.text}
        onChange={handleTextChange}
        placeholder={placeholder}
        variant={variant}
      />
    </motion.div>
  );
}

export function HeaderItem({ id }: { id: string }) {
  return <TextItem id={id} type="HEADER" />;
}

export function ParagraphItem({ id }: { id: string }) {
  return <TextItem id={id} type="PARAGRAPH" />;
}
