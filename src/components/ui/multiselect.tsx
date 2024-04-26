"use client";
import { cn } from "@/lib/utils";
import Select, { ClassNamesConfig } from "react-select";
import { useController, UseControllerProps } from "react-hook-form";

type Option = unknown;

type MultiSelectProps = UseControllerProps & {
  options: Option[];
  disabled?: boolean;
};

export default function MultiSelect({
  options,
  defaultValue,
  disabled,
  name,
  control,
}: MultiSelectProps) {
  const {
    field: { value, onChange: onChangeController, onBlur },
  } = useController({
    name,
    control,
    defaultValue: defaultValue || [],
  });

  return (
    <Select
      className={cn("font-forma text-sm")}
      classNames={classNames as ClassNamesConfig}
      value={value}
      isMulti
      name={name}
      options={options}
      onChange={onChangeController}
      onBlur={onBlur}
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
