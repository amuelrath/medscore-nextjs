// @/components/(admin)/forms/responses/response-cards.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TFormVersion } from "@/db/types";
import { Separator } from "@/components/ui/separator";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { getFullName } from "@/lib/getFullName";
import { useRouter, useSearchParams } from "next/navigation";

export function ResponseCards({
  formVersion,
}: {
  formVersion: TFormVersion | null | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVersionId = searchParams.get("versionId");
  const selectedResponseId = searchParams.get("responseId");

  const handleCardClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("versionId", selectedVersionId || "");
    params.set("responseId", id);
    router.push(`?${params.toString()}`);
  };

  if (!formVersion) {
    return <div>Version not found.</div>;
  }

  if (!formVersion.responses || formVersion.responses.length === 0) {
    return <div>No responses found.</div>;
  }

  return (
    <WaterfallAnimation speed={0.1}>
      {formVersion.responses.map((r) => (
        <Card
          key={r.id}
          onClick={() => handleCardClick(r.id)}
          className={cn(
            "mb-3 mt-1 flex cursor-pointer flex-row items-center justify-between p-2 drop-shadow-md transition-all",
            selectedResponseId === r.id
              ? "ring-2 ring-accent ring-offset-2"
              : "hover:ring-2 hover:ring-ring hover:ring-offset-2",
          )}
        >
          <div className={cn("flex flex-col items-start")}>
            <p className={cn("font-poppins text-xs font-bold text-gray-300")}>
              EVALUATEE
            </p>
            <p className={cn("font-poppins text-md")}>
              {getFullName(r.evaluatee)}
            </p>
          </div>
          <Separator orientation={"vertical"} />
          <div className={cn("flex flex-col items-end ")}>
            <p className={cn("font-poppins text-xs font-bold text-gray-300")}>
              EVALUATOR
            </p>
            <p className={cn("font-poppins text-md")}>
              {getFullName(r.creator)}
            </p>
          </div>
        </Card>
      ))}
    </WaterfallAnimation>
  );
}
