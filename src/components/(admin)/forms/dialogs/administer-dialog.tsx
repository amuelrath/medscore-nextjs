"use client";
import { isBefore, isAfter } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LottieHover } from "@/components/ui/lottie-hover";
import PENCIL from "public/icons/pencil-teal.json";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdministerForm } from "@/components/(admin)/forms/forms/administer-form";
import { ManageContent } from "@/components/(admin)/forms/forms/manage-form";
import { useFormContext } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";

export function AdministerDialog() {
  const [hovering, setHovering] = useState<boolean>(false);
  const { getValues } = useFormContext<TFormRelate>();
  const formId = getValues(`id`);
  const { data: formResult } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const now = new Date();
  const hasActiveCode = !!formResult?.formCodes.find(
    (fc) =>
      !fc.canceledAt&&
      isBefore(now, fc.expiresAt) &&
      isAfter(now, fc.startsAt),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs" variant="accent-secondary">
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="flex flex-row items-center space-x-2"
          >
            <LottieHover
              loop={false}
              isHovering={hovering}
              size="xs"
              src={PENCIL}
            />
            <span className="font-semibold text-teal-900">Administer</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="z-50 flex h-[500px] min-w-[650px] flex-col items-start">
        <DialogHeader className="w-full">
          <DialogTitle className="w-full">Manage Assessment</DialogTitle>
          <DialogDescription>
            Collect responses and manage administrations of this assessment.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="administer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="administer">Administer</TabsTrigger>
            <TabsTrigger value="manage">
              Manage
              {hasActiveCode && (
                <span className="ml-2 mt-0.5 size-2 bg-accent-secondary animate-pulse rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>
          <div className="h-full px-2">
            <TabsContent className="h-full" value="administer">
              <AdministerForm />
            </TabsContent>
            <TabsContent className="h-full" value="manage">
              <ManageContent />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
