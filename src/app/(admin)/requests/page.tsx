import { RequestsContent } from '@/components/(admin)/requests';
import { getAllFormsLite } from '@/server/actions/forms/get-all-forms-lite';
import { Suspense } from 'react';

export default async function RequestsPage() {
  const forms = await getAllFormsLite({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
  });

  return (
    <Suspense fallback="loading...">
      <RequestsContent initialForms={forms} />
    </Suspense>
  );
}
