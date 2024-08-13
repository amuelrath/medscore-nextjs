"use client";
import { Avatar, AvatarColor, AvatarStack } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@/db/schema";
import { useFormResultInEditor } from "@/hooks/queries/use-form-result-in-editor";
import { useMultiselectField } from "@/hooks/use-multiselect-field";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { getInitials } from "@/lib/get-initials";
import { getFullName } from "@/lib/helpers/getFullName";
import { truncate } from "@/lib/truncate";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type UserSelectProps<TSchema extends FieldValues> = {
  control: Control<TSchema>;
  name: FieldPath<TSchema>;
  disabled?: boolean;
};
// todo make this compatible with groups
export function UserSelect<T extends FieldValues>({
  disabled,
  name,
  control,
}: UserSelectProps<T>) {
  const { formResult } = useFormResultInEditor();
  const users = useMemo(() => {
    return formResult?.programs.users.map((u) => u.user) || [];
  }, [formResult?.programs.users]);

  const {
    selectedIds: selectedUserIds,
    select,
    deselect,
  } = useMultiselectField<T>({ name, control, disabled });

  const sortedUsers = useMemo(() => {
    return [
      ...users.filter((user) => selectedUserIds.includes(user.id)),
      ...users.filter((user) => !selectedUserIds.includes(user.id)),
    ];
  }, [users, selectedUserIds]);

  const getUserAvatarColor = (role: string): AvatarColor => {
    switch (role) {
      case "STUDENT":
        return "accent";
      case "ADMIN":
      case "FACULTY":
        return "primary";
      default:
        return "border";
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex flex-row space-x-3">
        <Avatar
          color="border"
          className="shadow-sm hover:shadow-md"
          content={<PlusIcon />}
        />
        <AvatarStack
          maxAvatars={4}
          avatars={selectedUserIds.map((id) => {
            const user = users.find((u) => u.id === id);
            return user
              ? {
                  content: getInitials(user),
                  tooltip: getFullName(user),
                  color: getUserAvatarColor(user.role),
                }
              : { content: "?" };
          })}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <Command>
          <CommandInput placeholder="Enter Respondent Name or Role" />
          <CommandList>
            <CommandGroup heading="Selected Users">
              {sortedUsers.map((u) => (
                <CommandItem
                  key={u.id}
                  onSelect={() =>
                    selectedUserIds.includes(u.id)
                      ? deselect(u.id)
                      : select(u.id)
                  }
                >
                  <UserCard
                    user={u}
                    selected={selectedUserIds.includes(u.id)}
                    onSelect={select}
                    onDeselect={deselect}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type UserCardProps = {
  user: Pick<User, "id" | "firstName" | "lastName" | "role">;
  selected: boolean;
  onSelect: (userId: string) => void;
  onDeselect: (userId: string) => void;
};

function UserCard({ user, selected, onSelect, onDeselect }: UserCardProps) {
  const getUserAvatarColor = (role: string): AvatarColor => {
    switch (role) {
      case "STUDENT":
        return "accent";
      case "ADMIN":
      case "FACULTY":
        return "primary";
      default:
        return "border";
    }
  };

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row space-x-2">
        <Avatar
          color={getUserAvatarColor(user.role)}
          content={getInitials(user)}
        />
        <span className="text-xs flex flex-col">
          <p>{truncate(getFullName(user), 30)}</p>
          <p className="text-neutral-500">{capitalizeFirstLetter(user.role)}</p>
        </span>
      </div>
      <Button
        size="xs"
        variant="hide"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          selected ? onDeselect(user.id) : onSelect(user.id);
        }}
      >
        {selected ? (
          <MinusIcon
            size={16}
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
        ) : (
          <PlusIcon
            size={16}
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
        )}
      </Button>
    </div>
  );
}
