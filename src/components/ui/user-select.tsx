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
import {
  UseMultiselectField,
  useMultiselectField,
} from "@/hooks/use-multiselect-field";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { getInitials } from "@/lib/get-initials";
import { getFullName } from "@/lib/helpers/getFullName";
import { cn } from "@/lib/helpers/utils";
import { truncate } from "@/lib/truncate";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";

interface UserSelectProps<T extends FieldValues>
  extends UseMultiselectField<T> {
  formId: string;
  disabledIds?: string[] | undefined;
}

// todo make this compatible with groups
export function UserSelect<T extends FieldValues>({
  disabled,
  name,
  control,
  defaultValue,
  max = 999,
  formId,
  disabledIds,
}: UserSelectProps<T>) {
  const { data: formResult, isLoading } = useQuery({
    queryKey: ["forms", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const users = useMemo(() => {
    return formResult?.programs.users.map((u) => u.user).filter(u => !disabledIds?.includes(u.id)) || [];
  }, [disabledIds, formResult?.programs.users]);

  const {
    selectedIds: selectedUserIds,
    select,
    deselect,
  } = useMultiselectField<T>({ name, control, disabled, max, defaultValue });

  const sortedUsers = useMemo(() => {
    return [
      ...users.filter((user) => selectedUserIds.includes(user.id)),
      ...users.filter((user) => !selectedUserIds.includes(user.id)),
    ].filter(user => !disabledIds?.includes(user.id)); // Filter out disabled users
  }, [users, selectedUserIds, disabledIds]);

  const isMaxReached = selectedUserIds.length >= max;

  // todo integrate this w programRoles
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
      <PopoverTrigger>
        <div role="button" className="flex max-w-44 flex-row space-x-3">
          {selectedUserIds.length === 0 && (
            <Avatar
              color="border"
              className="shadow-sm hover:shadow-md hover:border-foreground/50 transition group"
              content={<PlusIcon className="text-neutral-300 group-hover:text-foreground/50 transition" />}
            />
          )}
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
        </div>
      </PopoverTrigger>
      <PopoverContent side="left" align="start" className="w-[300px]">
        {isLoading ? (
          <p>Loading</p>
        ) : (
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
                      disabled={isMaxReached && !selectedUserIds.includes(u.id) || disabledIds?.includes(u.id)}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}

type UserCardProps = {
  user: Pick<User, "id" | "firstName" | "lastName" | "role">;
  selected: boolean;
  onSelect: (userId: string) => void;
  onDeselect: (userId: string) => void;
  disabled?: boolean;
};

function UserCard({
  user,
  selected,
  onSelect,
  onDeselect,
  disabled = false,
}: UserCardProps) {
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
    <div
      className={cn(
        "flex flex-row justify-between items-center w-full",
        disabled && "opacity-50",
      )}
    >
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
