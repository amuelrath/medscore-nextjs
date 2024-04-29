import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ReactQueryDevtools />
      {children}
    </>
  );
}
