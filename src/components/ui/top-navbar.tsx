import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function NavBar({ children }: { children: ReactNode }) {
  return (
    <nav
      className={cn(
        "fixed ml-10 flex flex-col justify-start px-6 pt-1 pb-4 w-full grid grid-cols-3 bg-primary"
      )}
    >
      {children}
    </nav>
  );
}

function Title({ children }: { children?: ReactNode }) {
  return <h1 className={cn("text-lg font-bold text-white")}>{children}</h1>;
}

function Subtitle({ children }: { children?: ReactNode }) {
  return (
    <sub className={cn("flex flex-row items-center text-sm text-notepad")}>
      {children}
    </sub>
  );
}

function Heading({ children }: { children?: ReactNode }) {
  return <div className={cn("col-start-1 col-span-1")}>{children}</div>;
}

function Actions({ children }: { children?: ReactNode }) {
  return (
    <div
      className={cn(
        "col-start-3 col-span-1 flex flex-row items-center text-white space-x-2 justify-center"
      )}
    >
      {children}
    </div>
  );
}

NavBar.Title = Title;
NavBar.Subtitle = Subtitle;
NavBar.Heading = Heading;
NavBar.Actions = Actions;
