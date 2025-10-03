import { z } from 'zod';

export const ZRoleWeightSchema = z.array(
  z.object({
    roleId: z.string().uuid(),
    weight: z.number(),
  }),
);
