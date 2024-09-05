import { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type TODO = any;

export interface CustomInput<TSchema extends FieldValues> {
  control: Control<TSchema>;
  name: FieldPath<TSchema>;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: PathValue<TSchema, FieldPath<TSchema>>;
}

export type MedscoreDatabase = PostgresJsDatabase<typeof import("C:/Users/Austin Muelrath/medscore-nextjs/src/db/schema")>
