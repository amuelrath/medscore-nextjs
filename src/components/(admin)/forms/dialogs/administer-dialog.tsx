"use client";

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

export function AdministerDialog() {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="accent-secondary" className="w-36">
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="flex flex-row items-center space-x-2"
          >
            <LottieHover
              loop={false}
              isHovering={hovering}
              size="sm"
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
            <TabsTrigger value="manage">Manage</TabsTrigger>
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
