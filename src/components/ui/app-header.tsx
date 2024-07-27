import { cn } from "@/lib/helpers/utils";
import Image from "next/image";
import LOGO from "public/logo-reversed.svg";

export function AppHeader() {
  return (
    <div className="flex bg-gradient-to-r from-primary from-[75%] to-accent-secondary h-10 min-w-screen flex-row items-center border-b border-neutral-300 px-2">
      <h3 className={cn("flex select-none flex-row text-2xl text-gray-600")}>
        <Image src={LOGO}  alt={"logo"} width={150} height={75} />
      </h3>
    </div>
  );
}
