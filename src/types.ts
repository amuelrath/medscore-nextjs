import { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

export type TODO = any;

export interface CustomInput<TSchema extends FieldValues> {
  control: Control<TSchema>;
  name: FieldPath<TSchema>;
  disabled?: boolean;
  defaultValue?: PathValue<TSchema, FieldPath<TSchema>>;
}
