import {User} from "@/db/schema";

export const getFullName = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const maxLength = 23; // Adjust the maximum length as needed

    if (fullName.length > maxLength) {
        return `${fullName.slice(0, maxLength - 3)}...`;
    }

    return fullName;
};