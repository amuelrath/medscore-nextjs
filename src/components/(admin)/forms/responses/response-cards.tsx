import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { getFullName } from "@/lib/getFullName";
import { useSelectedContext } from "@/providers/selected-values-provider";

export function ResponseCards() {
  const { selectedResponse, setSelectedResponse, selectedVersion } =
    useSelectedContext();

  const handleResponseClick = (responseId: string) => {
    const response = selectedVersion?.responses.find(
      (r) => r.id === responseId,
    );
    setSelectedResponse(response);
  };

  if (!selectedVersion) {
    return <div>Version not found.</div>;
  }

  if (!selectedVersion.responses || selectedVersion.responses.length === 0) {
    return <div>No responses found.</div>;
  }

  return (
    <WaterfallAnimation noExit key={selectedVersion.id} speed={0.1}>
      {selectedVersion.responses.map((r) => (
        <Card
          key={r.id}
          onClick={() => handleResponseClick(r.id)}
          className={cn(
            "mb-3 mt-1 flex cursor-pointer flex-row items-center justify-between p-2 drop-shadow-md transition-all",
            selectedResponse?.id === r.id
              ? "ring-2 ring-accent ring-offset-2"
              : "hover:ring-2 hover:ring-ring hover:ring-offset-2",
          )}
        >
          <div className={cn("flex flex-col items-start")}>
            <p className={cn("text-xs font-bold text-gray-300")}>EVALUATEE</p>
            <p className={cn(" text-md")}>{getFullName(r.evaluatee)}</p>
          </div>
          <Separator orientation={"vertical"} />
          <div className={cn("flex flex-col items-end ")}>
            <p className={cn("text-xs font-bold text-gray-300")}>EVALUATOR</p>
            <p className={cn("text-md")}>{getFullName(r.creator)}</p>
          </div>
        </Card>
      ))}
    </WaterfallAnimation>
  );
}
