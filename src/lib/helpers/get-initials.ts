import { User } from "@/db/schema";

type InitialsInput = Pick<User, "firstName" | "lastName"> | string | undefined;

export function getInitials(input: InitialsInput): string {
  if (typeof input === "string") {
    // Handle string input
    const words = input.trim().split(/\s+/);
    if (words.length === 1) {
      return input.slice(0, 2).toUpperCase();
    } else {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
  } else if (input && "firstName" in input && "lastName" in input) {
    // Handle User object
    const firstInitial = input.firstName.charAt(0).toUpperCase();
    const lastInitial = input.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  } else {
    // Handle undefined or invalid input
    return "??";
  }
}
