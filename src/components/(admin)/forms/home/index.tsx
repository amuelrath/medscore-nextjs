"use client";
import {
  QueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import {
  BookOpenIcon,
  EditIcon,
  FileIcon,
  FileTextIcon,
  TelescopeIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ACGME_LOGO from "public/image/ACGME_Logo.jpg";
import Meteors from "@/components/magicui/meteors";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { random } from "lodash";
import { Button } from "@/components/ui/button";
import { deleteForm } from "@/server/actions/forms/delete-form";
import { DeleteFormDialogTrigger } from "@/components/(admin)/forms/dialogs/delete-evaluation-dialog";
import { toast } from "sonner";
import WaterfallAnimation from "@/components/ui/waterfall-animation";

interface BentoCardProps {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href?: string;
  onClick?: () => void;
  cta: ReactNode | string;
}

export default function FormsHome() {
  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms", "lite"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30,
      },
    },
  });

  const handleHover = async (formId: string) => {
    await queryClient.fetchQuery({
      queryKey: ["form", formId],
      queryFn: () =>
        getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
    });
  };

  return (
    <BentoGrid>
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
      <motion.div
        initial={{ opacity: 0, y: random(7, 25) }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("col-span-5 w-full")}
      >
        <h3 className={cn("text-2xl font-semibold text-neutral-700")}>
          Recent Forms
        </h3>
        <ScrollArea className={cn("h-[89.5%] pr-4")}>
          <Scrollbar />
          <WaterfallAnimation>
            {forms.map((form) => (
              <div
                key={form.id}
                className={cn(
                  "group my-2 flex w-full select-none flex-row items-center justify-between rounded-md bg-white p-4 drop-shadow-md transition-colors hover:bg-background",
                )}
              >
                <div className={cn("flex flex-col items-start")}>
                  <Link
                    onMouseEnter={() => handleHover(form.id)}
                    className={cn("cursor-pointer font-semibold")}
                    href={`/forms/${form.id}`}
                  >
                    {form.title}
                  </Link>
                  <p className={cn("text-sm text-neutral-400 hover:underline")}>
                    {form.programs.name}
                  </p>
                </div>
                <div className={cn("flex flex-row items-center space-x-2")}>
                  <Link
                    href={`/forms/${form.id}`}
                    onMouseEnter={() => handleHover(form.id)}
                  >
                    <Button
                      variant={"foreground"}
                      size={"sm"}
                      className={cn(
                        "w-20 opacity-0 transition-opacity group-hover:opacity-100",
                      )}
                    >
                      <EditIcon />
                    </Button>
                  </Link>
                  <DeleteFormDialogTrigger form={form}>
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      className={cn(
                        "opacity-0 transition-opacity group-hover:opacity-100",
                      )}
                    >
                      <TrashIcon />
                    </Button>
                  </DeleteFormDialogTrigger>
                </div>
              </div>
            ))}
          </WaterfallAnimation>
        </ScrollArea>
      </motion.div>
    </BentoGrid>
  );
}

const features: BentoCardProps[] = [
  {
    name: "New Form",
    description:
      "Create a new OSCE, Survey, or other Competency-Based Assessment.",
    Icon: FileTextIcon,
    cta: <CreateFormDialogTrigger>Create New Form</CreateFormDialogTrigger>,
    className: "xs:col-span-1 md:col-span-3 lg:col-span-5 select-none",
    background: (
      <Marquee pauseOnHover className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
        {Array.from({ length: 5 }).map((value, index) => (
          <FileIcon key={index} className="size-44 origin-left" />
        ))}
      </Marquee>
    ),
  },
  {
    name: "Resources",
    description:
      "Access ACGME guidelines to create high-quality, competency-based assessments.",
    Icon: BookOpenIcon,
    onClick: () => window.open("https://www.acgme.org/milestones/resources/"),
    cta: "Go to ACGME Resources",
    className:
      "md:col-span-2 xs:col-span-1 lg:col-span-2 select-none relative group",
    background: (
      <Image
        className={cn(
          "absolute left-[32%] top-[15%]  transition-all [mask-image:linear-gradient(to_top,transparent_27%,#000_100%)] group-hover:blur-sm",
        )}
        src={ACGME_LOGO}
        alt={"ACGME Logo"}
        height={256}
        width={256}
      />
    ),
  },
  {
    name: "Explore",
    description: "Browse community-made assessments.",
    Icon: TelescopeIcon,
    cta: "Explore Assessments",
    className: "xs:col-span-1 md:col-span-1 lg:col-span-2 select-none",
    background: (
      <div className={cn("mr-24")}>
        <Meteors  number={40} />
      </div>
    ),
  },
];
