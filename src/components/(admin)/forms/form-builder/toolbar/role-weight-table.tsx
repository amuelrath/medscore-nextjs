'use client';

import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { ZRoleWeightSchema } from '@/components/(admin)/forms/form-builder/types';
import { FormResult } from '@/server/actions/forms/get-form-by-id';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react'; // Add this import
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const ZRoleWeightFormSchema = z.object({
  roleWeights: ZRoleWeightSchema,
});

type TRoleWeightFormSchema = z.infer<typeof ZRoleWeightFormSchema>;

interface RoleWeightTableProps {}

export function RoleWeightTable() {
  // get the formId from params
  const params = useParams();
  const formId = params.formId.toString();

  // interface with query cache
  const queryClient = useQueryClient();
  const roles = queryClient.getQueryData<FormResult>(['form', formId])
    ?.programs.roles

  // Only extract the store functions you actually need
  const setSettings = useFormBuilderStore((state) => state.setSettings);

  // Memoize defaultValues to prevent recreating on each render
  const defaultValues = useMemo(
    () => ({
      roleWeights: roles?.map((role) => ({
        roleId: role.id,
        weight: 1,
      })),
    }),
    [roles],
  );

  // initialize hook form
  const { control } = useForm<TRoleWeightFormSchema>({
    defaultValues: defaultValues || { roleWeights: [] },
    resolver: zodResolver(ZRoleWeightFormSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'roleWeights',
  });

  // ensure that we have roles defined for this program
  if (!roles) {
    return <>No Roles Found</>; // TODO more robust error handling
  }

  return (
    <div className="flex flex-col space-y-2 max-h-[40vh] overflow-y-auto snap-y snap-mandatory" >
      {fields.map((field) => (
        <div key={field.id} className="p-3 border rounded font-semibold text-md snap-start" >
          {roles.find((r) => r.id === field.roleId)?.roleName || 'Unknown Role'}
        </div>
      ))}
    </div>
  );
}
