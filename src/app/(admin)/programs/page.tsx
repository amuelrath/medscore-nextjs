import { ProgramsHome } from "@/components/(admin)/programs/home";
import { ProgramsToolbar } from "@/components/(admin)/programs/common/programs-toolbar";

export default function ProgramsPage() {
  return (
    <main className="flex h-full w-full flex-col">
        <ProgramsToolbar />
        <ProgramsHome />
    </main>
  );
}