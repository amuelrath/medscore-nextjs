"use client";
import React, { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cn } from "@/lib/helpers/utils";
import {
  FormLiteResult,
  FormsLiteResult,
  getAllFormsLite,
} from "@/server/actions/forms/get-all-forms-lite";
import { FormCard } from "@/components/(admin)/forms/home/form-card";
import { FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSetAtom } from "jotai/index";
import { breadcrumbsAtom } from "@/store/global-atoms";
import { CreateFormDialog } from "@/components/(admin)/forms/home/create-form-dialog";
import { TagFilter } from "@/components/(admin)/forms/home/tag-filter";
import { TFormType } from "@/db/schema";
import { AnimatePresence, motion } from "framer-motion";

interface FormsListProps {
  filteredForms: FormLiteResult[];
}

const FormsList: React.FC<FormsListProps> = ({ filteredForms }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {filteredForms.map((form, index) => (
          <motion.div
            key={form.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 50,
              opacity: { duration: 0.2 },
              height: { duration: 0.4 },
              delay: index * 0.05, // Stagger the animations
            }}
            style={{ overflow: 'hidden' }}
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
    <main className="flex h-screen flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-neutral-300 bg-card/50 p-1 pl-4 pr-2">
        <div className="flex items-center space-x-2">
          <FileIcon className="size-6 text-neutral-500" />
          <h3 className={cn("text-2xl font-bold text-neutral-700")}>
            My Forms
          </h3>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-2/3 flex-col overflow-hidden p-4">
          <FormsListToolbar
            handleFilter={handleFilter}
            handleTagSelect={handleTagSelect}
            handleTagRemove={handleTagRemove}
            uniqueTags={uniqueTags as TFormType[]}
            selectedTag={selectedTag}
          />
          <div className="flex-1 overflow-y-scroll no-scrollbar">
            <FormsList filteredForms={filteredForms} />
          </div>
        </div>
        <div className="w-1/2 flex-shrink-0 border-l border-neutral-200 p-4">
          <div className="space-y-4">{/* something else */}</div>
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
        <Input
          size="sm"
          placeholder="Search Forms..."
          className={cn("w-60 text-sm")}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          <TagFilter
            tags={uniqueTags}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
            selectedTag={selectedTag}
          />
        </div>
      </div>
        <CreateFormDialog />
    </div>
  );
}
