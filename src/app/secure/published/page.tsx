import PageHeader from "@/components/ui/page-header";
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export default function PublishedPage() {
  return (
    <main className={cn("min-h-screen w-full space-y-2")}>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h3 className={cn("text-2xl font-bold")}>Published Evaluations</h3>
          <p className={cn("text-xs")}>control and administer evaluations</p>
        </div>
      </PageHeader>
    </main>
  );
}
