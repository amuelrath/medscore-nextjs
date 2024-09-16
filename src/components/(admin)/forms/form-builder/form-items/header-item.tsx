import { Base } from '@/components/(admin)/forms/form-builder/form-items/base';
import { TFormBuilderSchema } from '@/components/(admin)/forms/form-builder/form-items/types';
import { AutosizeTextarea } from '@/components/ui/autosize-text-area';
import { Control, Controller } from 'react-hook-form';
import { motion } from 'framer-motion'

function AddDescriptionButton() {
  return (
    <div className="flex flex-row bg-primary/[2%] rounded transition-colors p-2.5 hover:bg-primary/5 cursor-pointer items-center space-x-2">
      <p className="opacity-50 text-xs">Add Description</p>
    </div>
  );
}

interface HeaderItemProps {
  id: string;
  index: number;
  control: Control<TFormBuilderSchema>;
  remove: () => void;
}

export function HeaderItem({ id, index, control, remove }: HeaderItemProps) {
  return (
    <Base
      key={id}
      required={false}
      onCopyClick={() => null}
      index={index}
      onDeleteClick={remove}
    >
      <motion.div layout="position" className="space-y-3 pb-6">
        <Controller
          control={control}
          name={`formItems.${index}.text`}
          render={({ field }) => (
            <AutosizeTextarea
              className="text-sm font-semibold"
              variant="typography"
              name={field.name}
              disabled={field.disabled}
              value={field.value}
              ref={field.ref}
              onChange={field.onChange}
            />
          )}
        />
        <div className="flex flex-col">
          <AddDescriptionButton />
        </div>
      </motion.div>
    </Base>
  );
}
