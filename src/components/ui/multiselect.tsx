// MultiSelect.tsx
"use client";

import { cn } from "@/lib/utils";
import Select, { ActionMeta, ClassNamesConfig, MultiValue } from "react-select";

type Option = unknown;

type MultiSelectProps = {
  options: Option[];
  disabled?: boolean;
  value?: MultiValue<Option>;
  onChange?: (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
};

export default function MultiSelect({
  options,
  disabled,
  value,
  onChange,
}: MultiSelectProps) {
  return (
    <Select
      className={cn("font-forma text-sm")}
      classNames={classNames as ClassNamesConfig}
      value={value}
      isMulti
      options={options}
      onChange={onChange}
      isDisabled={disabled}
      closeMenuOnSelect={false}
      unstyled
    />
  );
}

const classNames = {
  control: (state) =>
    "bg-background border rounded-md p-2 text-primary transition-all",
  valueContainer: (state) => "gap-2",
  indicatorsContainer: (state) => "text-primary",
  dropdownIndicator: (state) => "invisible",
  option: (state) => "hover:bg-secondary p-1 rounded-sm",
  menu: (state) => "bg-background border rounded-md px-2 text-md",
  menuList: (state) => "pb-2 mt-2",
  multiValue: (state) => "hover:bg-secondary rounded-md border p-1",
  multiValueLabel: (state) => "",
  multiValueRemove: (state) => "",
  placeholder: (state) => "",
  singleValue: (state) => "",
} satisfies ClassNamesConfig;
