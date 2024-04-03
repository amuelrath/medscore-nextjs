"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getMilestones } from "../../actions";
import {
  ArrowUpNarrowWide,
  ChevronDownCircleIcon,
  ChevronUpCircleIcon,
} from "lucide-react";
import Select, {
  ClassNamesConfig,
  DropdownIndicatorProps,
  InputProps,
  components,
} from "react-select";
import { db } from "@/db";
import { Milestone } from "@/db/schema";
import { ClientMilestone } from "@/db/client-types";

const styles = {
  container: (state) => "font-forma",
  menu: (state) => "bg-black",
  control: (state) => "font-forma",
  input: (state) => "font-forma  py-1.5",
  placeholder: (state) => "hidden",
  dropdownIndicator: (state) =>
    "absolute text-sm p-1 hover:bg-primary hover:text-white transition-all rounded-full",
  menuList: (state) => "bg-white border space-y-4",
} as ClassNamesConfig;

export default function MilestoneSelector({
  milestones,
}: {
  milestones: ClientMilestone[];
}) {
  const options = milestones.map((milestone) => ({
    value: milestone.id,
    label: milestone.description,
  }));
  return (
    <div className="mr-8">
      <Select
        classNames={styles}
        unstyled
        components={{ DropdownIndicator: Indicator }}
        isSearchable={false}
        options={options}
      />
    </div>
  );
}

const Indicator = ({ ...props }: DropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <ChevronDownCircleIcon size={"1rem"} />
  </components.DropdownIndicator>
);
