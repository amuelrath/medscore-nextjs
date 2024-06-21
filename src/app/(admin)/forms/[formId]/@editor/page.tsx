// forms/[formId]/@editor/page.tsx
import QuestionCards from "@/components/(admin)/forms/editor/questions";
import { Background } from "@/components/ui/background";

export default function EditorPage() {
  return (
    <div className="relative min-h-full">
      <Background />
      <QuestionCards />
    </div>
  );
}
