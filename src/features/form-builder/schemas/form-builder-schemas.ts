import { ZFormItemSchema } from '@/features/form-builder/schemas/form-item-schemas';
import { ZFormBuilderSettingsSchema } from '@/features/form-builder/schemas/settings-schemas';
import { z } from 'zod';

export const ZFormBuilderSchema = z.object({
  id: z.string().uuid().describe("The Form's ID"),
  title: z.string().describe("The Form's Title"),
  settings: ZFormBuilderSettingsSchema,
  formItems: z.array(ZFormItemSchema),
});
