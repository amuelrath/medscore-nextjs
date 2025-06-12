'use client';

import { FormCard } from '@/features/forms-home/components/form-cards/form-card';
import { FormsLiteResult } from '@/features/forms-home/actions/forms/get-all-forms-lite';
import { AnimatePresence } from 'framer-motion';

interface FormsListProps {
  filteredForms: FormsLiteResult | undefined;
}

export function FormsList({ filteredForms }: FormsListProps) {
  return (
    <div
      className="flex-grow gap-4 auto-rows-[11rem] grid grid-cols-5 pr-2" /* padding to offset scrollbar  */
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredForms && filteredForms.length > 0 ? (
          filteredForms.map((form) => (
            <FormCard
              key={form.id}
              formId={form.id}
              title={form.title}
              lastOpenedAt={form.lastOpenedAt}
              type={form.type}
            />
          ))
        ) : (
          <span className="absolute opacity-80 text-center">
            <p className="text-xl font-semibold">No Forms Found</p>
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}
