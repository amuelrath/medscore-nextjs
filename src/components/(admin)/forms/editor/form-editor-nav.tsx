'use client';

import { isSavingAtom } from '@/components/(admin)/forms/editor/atoms';
import { TFormSchema } from '@/components/(admin)/forms/editor/hooks/use-form-builder';
import { SaveFormButton } from '@/components/(admin)/forms/editor/save-form-button';
import { SettingsDialog } from '@/components/(admin)/forms/editor/settings/settings-dialog';
import { DirectionAwareTabs } from '@/components/ui/direction-aware-tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/helpers/utils';
import { useAtom } from 'jotai';
import { useFormContext } from 'react-hook-form';

export function FormEditorNav() {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);

  const [isSaving] = useAtom(isSavingAtom);

  return (
    <div className="flex h-12 w-full flex-row items-center justify-between border-b border-neutral-300 bg-card/50 p-1 px-2">
      <div className={cn('flex flex-row items-center space-x-2')}>
        <Input
          size="sm"
          className={cn(
            'w-64 border border-neutral-300 text-xl font-medium hover:border-neutral-600',
          )}
          defaultValue={title}
          {...register('title')}
        />
        <DirectionAwareTabs size="sm" />
        <SaveFormButton isSaving={isSaving} />
      </div>
      <div className={cn('flex flex-row space-x-2')}>
        <SettingsDialog />
      </div>
    </div>
  );
}
