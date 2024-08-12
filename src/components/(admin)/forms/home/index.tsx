"use client";
import { CreateFormDialog } from "@/components/(admin)/forms/home/create-form-dialog";
import { EvaluateSection } from "@/components/(admin)/forms/home/evaluate-section";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { QuickEvaluateDialog } from "@/components/(admin)/forms/home/quick-evaluate-dialog";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TFormType } from "@/db/schema";
import { cn } from "@/lib/helpers/utils";
import {
  FormLiteResult,
  FormsLiteResult,
  getAllFormsLite,
} from "@/server/actions/forms/get-all-forms-lite";
import { breadcrumbsAtom } from "@/store/global-atoms";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai/index";
import { FileIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FormsListProps {
  filteredForms: FormLiteResult[];
}

const FormsList: React.FC<FormsListProps> = ({ filteredForms }) => {
  return (
    <div className="space-y-4 origin-top no-scrollbar overflow-y-scroll flex-grow">
      <AnimatePresence initial={false} >
        {filteredForms.map((form) => (
          <motion.div
            key={form.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 50,
              opacity: { duration: 0.2 },
            }}
          >
            <FormCard form={form} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const FormsHome: React.FC = () => {
  const setBreadcrumbs = useSetAtom(breadcrumbsAtom);
  const [filteredForms, setFilteredForms] = useState<FormsLiteResult>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<TFormType | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: "Forms", href: "/forms" }]);
  }, [setBreadcrumbs]);

  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllFormsLite({
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }),
  });

  useEffect(() => {
    const orderedForms = forms.sort(
      (a, b) =>
        new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime(),
    );

    setFilteredForms(
      orderedForms.filter((form) => {
        const matchesSearch = form.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? form.type === selectedTag : true;
        return matchesSearch && matchesTag;
      }),
    );
  }, [forms, searchTerm, selectedTag]);

  const uniqueTags = Array.from(new Set(forms.map((f) => f.type)));

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

  const handleTagSelect = (tag: TFormType) => {
    setSelectedTag(tag);
  };

  const handleTagRemove = () => {
    setSelectedTag(null);
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border bg-card/50 p-1 pl-4 pr-2">
        <span className="flex items-center space-x-2">
          <FileIcon className="size-6 text-neutral-500" />
          <h3 className={cn("text-2xl font-bold text-neutral-700")}>
            Evaluations
          </h3>
        </span>
        <div className="space-x-4 flex flex-row items-center">
          <CreateFormDialog />
          <QuickEvaluateDialog />
        </div>
      </div>
      <div className="grid grid-cols-2 h-full pb-10 flex-grow overflow-hidden">
        <div className="flex flex-col overflow-hidden p-4">
          <FormsListToolbar
            handleFilter={handleFilter}
            handleTagSelect={handleTagSelect}
            handleTagRemove={handleTagRemove}
            uniqueTags={uniqueTags as TFormType[]}
            selectedTag={selectedTag}
          />
          <FormsList filteredForms={filteredForms} />
        </div>
        <div className="min-h-full border-l grid grid-cols-2 gap-4 grid-rows-2 w-full bg-primary/5 p-4 overflow-y-auto">
          <EvaluateSection />
        </div>
      </div>
    </main>
  );
};

interface FormsListToolbarProps {
  handleFilter: (term: string) => void;
  handleTagSelect: (tag: TFormType) => void;
  handleTagRemove: () => void;
  uniqueTags: TFormType[];
  selectedTag: TFormType | null;
}

function FormsListToolbar({
  handleFilter,
  handleTagSelect,
  handleTagRemove,
  uniqueTags,
  selectedTag,
}: FormsListToolbarProps) {
  return (
    <div className="mb-4 flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-3.5 size-3 opacity-50" />
          <Input
            variant="underline"
            placeholder="Search my forms..."
            className={cn("pl-8 font-light")}
            onChange={(e) => handleFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <TagFilter
            tags={uniqueTags}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
            selectedTag={selectedTag}
          />
        </div>
      </div>
      <Select defaultValue={"ALL"}>
        <SelectTrigger className="max-w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Forms</SelectItem>
          <SelectItem value="MY_FORMS">My Forms</SelectItem>
          <SelectItem value="SHARED">Shared With Me</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
