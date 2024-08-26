'use client'



import { ChevronDownIcon } from "lucide-react";

export function ProgramsToolbar() {
  return (
    <header className="flex h-12 w-full flex-row items-center space-x-4 border-b border-neutral-300 bg-card/50 p-1 px-2" >
     <div className="flex flex-row space-x-2 items-center" >
      <p className="text-2xl font-bold text-neutral-700" >
      Family Medicine Residency
      </p>
       <ChevronDownIcon size={24} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
     </div>
      {/*  */}
    </header>
  )
}