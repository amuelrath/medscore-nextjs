'use client'
import { useSetAtom } from "jotai";
import { breadcrumbsAtom } from "@/store/global-atoms";
import { useEffect } from "react";

export function ProgramsHome() {
  // update breadcrumbs
  const setBreadcrumbs = useSetAtom(breadcrumbsAtom)

  useEffect(() => {
    setBreadcrumbs([{ label: "Programs", href: "#" }])
  }, [setBreadcrumbs]);

  return (
    <main className="h-full p-4 grid grid-cols-5 gap-4">
      <div className="border border-neutral-300 rounded-md col-span-1">
        {/* some kind of nav sidebar for taking actions */}
      </div>
        <div className="border border-neutral-300 rounded-md col-span-4">
          {/* content of those actions */}
      </div>
    </main>
  )
}