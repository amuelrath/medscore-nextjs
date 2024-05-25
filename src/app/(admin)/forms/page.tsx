"use client";
import { trpc } from "@/app/_trpc/client";
import FormViewerSection from "@/components/(admin)/forms/viewer";
import { TFormRelate } from "@/db/types";

export default function SecureEvaluationsHomePage() {
  const query = trpc.forms.all.useSuspenseQuery({
    userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
  },  { staleTime: 1000 *  60 * 5 }); // 5-minute fresh time
  return <FormViewerSection forms={query[0] as unknown as TFormRelate[]} />;
}
