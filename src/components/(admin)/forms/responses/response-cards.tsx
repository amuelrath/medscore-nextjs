import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TFormVersion } from "@/db/types";
import { Separator } from "@/components/ui/separator";
import { User } from "@/db/schema";
import { useSelectedResponseId } from "@/providers/selected-response-id-provider";
import WaterfallAnimation from "@/components/ui/waterfall-animation";

export function ResponseCards({ formVersion }: { formVersion: TFormVersion }) {
  const { selectedResponseId, setSelectedResponseId } = useSelectedResponseId();

  const getFullName = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const maxLength = 23; // Adjust the maximum length as needed

    if (fullName.length > maxLength) {
      return `${fullName.slice(0, maxLength - 3)}...`;
    }

    return fullName;
  };

  const handleCardClick = (id: string) => {
    setSelectedResponseId(id);
  };

  return (
    <WaterfallAnimation speed={0.1}>
      {formVersion?.responses?.map((r) => (
        <Card
          key={r.id}
          onClick={() => handleCardClick(r.id)}
          className={cn(
            "mb-3 flex flex-row items-center justify-between p-2 drop-shadow-md transition-all",
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
