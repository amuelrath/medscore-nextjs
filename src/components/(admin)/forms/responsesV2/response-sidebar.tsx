import { ReactNode } from "react";

interface ResponsesSidebarProps {
 children?: ReactNode
}

export function ResponseSidebar({ children}: ResponsesSidebarProps) {

  return (
    <aside className="col-span-2 mb-2 z-40 backdrop-filter rounded-lg p-2 border-2 border-opacity-10 border-blue-200 border-b bg-blue-950 bg-opacity-15 backdrop-blur-2xl px-2 shadow-md" >
      {children}
    </aside>
  )

}