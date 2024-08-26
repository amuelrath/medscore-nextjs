'use client';

import {
  AssessmentCreatorDialog,
  TAssessmentEditorFormSchema,
} from '@/components/(admin)/forms/home/assessment-manager/assessment-creator-dialog';
import { CreateFormDialog } from '@/components/(admin)/forms/home/create-form-dialog';
import { DeleteFormDialogTrigger } from '@/components/(admin)/forms/home/delete-evaluation-dialog';
import { EvaluateSection } from '@/components/(admin)/forms/home/evaluate-section';
import { TagFilter } from '@/components/(admin)/forms/home/tag-filter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TFormType } from '@/db/schema';
import { formTypeContent } from '@/lib/constants/forms';
import { cn } from '@/lib/helpers/utils';
import { truncate } from '@/lib/truncate';
import { createAssessmentWithRequests } from '@/server/actions/assessments/create-assessment-with-requests';
import {
  FormLiteResult,
  FormsLiteResult,
  getAllFormsLite,
} from '@/server/actions/forms/get-all-forms-lite';
import { breadcrumbsAtom } from '@/store/global-atoms';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { addHours, formatDistance } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useSetAtom } from 'jotai/index';
import { ClockIcon, Edit3, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function FormCard({
  type,
  title,
  id,
  lastOpenedAt,
}: {
  type: TFormType;
  title: string;
  id: string;
  lastOpenedAt: Date;
}) {
  const router = useRouter();
  const Icon = formTypeContent[type];

  return (
    <Card
      className={cn(
        'col-span-1 relative hover:shadow-md h-full pt-0.5 overflow-clip bg-primary/20',
      )}
    >
      <span
        className={cn(
          'absolute opacity-50 text-primary top-5 blur-sm pointer-events-none',
        )}
      >
        <Icon size={128} />
      </span>
      <div className="absolute text-nowrap flex origin-center font-medium select-none  flex-col w-full p-2 text-sm z-20 h-14 backdrop-opacity-20 backdrop-filter bg-card bottom-0">
        <div className="justify-between items-center flex flex-row">
          <p className="underline underline-offset-2">{truncate(title, 20)}</p>
          <div className="flex h-6 flex-row justify-end items-center space-x-2">
            <Button
              size="xs"
              variant="hide"
              onClick={() => router.push(`/forms/${id}`)}
            >
              <Edit3
                size={16}
                className="opacity-50 hover:opacity-100 transition-opacity"
              />
            </Button>
            <DeleteFormDialogTrigger id={id} title={title}>
              <Button size="xs" variant="hide">
                <TrashIcon
                  size={16}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                />
              </Button>
            </DeleteFormDialogTrigger>
          </div>
        </div>
        <div className="flex items-center opacity-50 text-xs flex-row space-x-1.5">
          <ClockIcon size={10} />
          <span>
            {formatDistance(new Date(lastOpenedAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

interface FormsListProps {
  filteredForms: FormLiteResult[];
}

function FormsList({ filteredForms }: FormsListProps) {
  return (
    <div className="flex-grow gap-4 auto-rows-[8.53rem] grid grid-cols-3">
      <AnimatePresence initial={false}>
        {filteredForms.map((form) => (
          <motion.div
            key={form.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 50,
              opacity: { duration: 0.2 },
            }}
          >
            <FormCard
              id={form.id}
              title={form.title}
              lastOpenedAt={form.lastOpenedAt}
              type={form.type}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function FormsHome() {
  const setBreadcrumbs = useSetAtom(breadcrumbsAtom);
  const [filteredForms, setFilteredForms] = useState<FormsLiteResult>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<TFormType | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Forms', href: '/forms' }]);
  }, [setBreadcrumbs]);

  const { data: forms } = useSuspenseQuery({
    queryKey: ['forms'],
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
    <main className="flex flex-grow flex-col">
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border bg-card p-1 pl-4 pr-2">
        <div className="flex items-center flex-row space-x-4 text-neutral-700">
          <h3 className={cn('text-md font-medium')}>Forms</h3>
        </div>
        <div className="space-x-4 flex flex-row items-center" />
      </div>
      <FormsListToolbar
        handleFilter={handleFilter}
        handleTagSelect={handleTagSelect}
        handleTagRemove={handleTagRemove}
        uniqueTags={uniqueTags as TFormType[]}
        selectedTag={selectedTag}
      />
      <div className="grid grid-cols-6 gap-4 gap-y-0 flex-grow px-4 pb-4 pt-2">
        <div className="flex flex-col col-span-4">
          <FormsList filteredForms={filteredForms} />
        </div>
        <div className="col-span-2 h-full">
          <EvaluateSection />
        </div>
      </div>
    </main>
  );
}

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
  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const queryClient = useQueryClient();
  const { mutate: createAssessmentMutation } = useMutation({
    mutationFn: createAssessmentWithRequests,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const submitFn = (data: TAssessmentEditorFormSchema) => {
    createAssessmentMutation({
      ...data,
    });
  };

  return (
    <div className="px-4 pt-2 flex justify-between">
      <div className="flex items-center flex-row space-x-4">
        <Input
          size="xs"
          placeholder="Search my forms..."
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
      <div className="flex flex-row items-center space-x-2">
        <CreateFormDialog />
        {!isLoading && forms && (
          <AssessmentCreatorDialog
            forms={forms}
            defaultValues={{
              startsAt: new Date().toISOString(),
              expiresAt: addHours(new Date(), 4).toISOString(),
            }}
            submitFn={submitFn}
          />
        )}
      </div>
    </div>
  );
}
