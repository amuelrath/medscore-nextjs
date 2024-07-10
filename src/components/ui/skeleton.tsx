import { cn } from "@/lib/helpers/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-blue-950/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
