import { cn } from "@/lib/utils";
import LOGO_FULL from "public/white@2x.png";

import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col grow">
      <div
        className={cn(
          "z-30 w-full h-16 bg-white flex justify-between items-center p-2 border-b"
        )}
      >
        <Image src={LOGO_FULL} alt="logo" className={cn("w-32")} />
        <div
          className={cn(
            "rounded-full size-10 bg-white border-2 border-primary"
          )}
        />
      </div>
      <main className={cn("px-8 grow p-2 bg-background")}>{children}</main>
    </div>
  );
}
