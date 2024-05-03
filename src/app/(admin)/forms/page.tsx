"use client";
import { trpc } from "@/app/_trpc/client";
import FormViewerSection from "@/components/(evaluations)/sections/form-viewer";
import LoadingSection from "@/components/(evaluations)/sections/loading-section";
import { TFormRelate } from "@/db/types";
import { Suspense } from "react";

export default function SecureEvaluationsHomePage() {
  const query = trpc.forms.all.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
  });
  return (
    <Suspense fallback={<LoadingSection />}>
      <FormViewerSection forms={query[0] as unknown as TFormRelate[]} />
    </Suspense>
  );
}
