"use client";
import { trpc } from "@/app/_trpc/client";
import FormViewerSection from "@/components/(admin)/forms/viewer";
import { TFormRelate } from "@/db/types";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

export default function SecureEvaluationsHomePage() {
  const query = trpc.forms.all.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
  });
  return (
    <Suspense fallback={<Loading />}>
      <FormViewerSection forms={query[0] as unknown as TFormRelate[]} />
    </Suspense>
  );
}
