import { cn } from "@/lib/helpers/utils";

export function AppHeader() {
  return (
    <div className="flex h-12 min-h-12 w-full flex-row items-center border-b border-neutral-300 bg-card px-4">
      <h3 className={cn("flex select-none flex-row text-2xl text-gray-600")}>
        <p className={cn("font-bold ")}>MED</p>
        <p className={cn("font-extralight ")}>score</p>
      </h3>
    </div>
  );
}
