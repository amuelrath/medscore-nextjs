import { cn } from "@/lib/helpers/utils";
import Image from "next/image";
import LOGO from "public/logo2.png";

export function AppHeader() {
  return (
    <div className="flex h-12 min-h-12 w-full flex-row items-center border-b border-neutral-300 bg-card px-2">
      <h3 className={cn("flex select-none flex-row text-2xl text-gray-600")}>
        <Image src={LOGO} alt={"logo"} width={175} height={100} />
      </h3>
    </div>
  );
}
