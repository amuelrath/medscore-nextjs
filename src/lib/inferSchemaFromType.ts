import { z } from "zod";

type inferSchemaFromType<T> = {
  [K in keyof T]: z.ZodType<T[K]>;
};

export function createZodSchema<T>() {
  return z.object<inferSchemaFromType<T>>({} as inferSchemaFromType<T>);
}
