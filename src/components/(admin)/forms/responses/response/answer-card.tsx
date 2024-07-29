import { TFormItemType } from "@/db/schema";
import { SubcompetencyResult } from "@/server/actions/forms/get-subcompetencies";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/helpers/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MilestoneBadge } from "@/components/(admin)/forms/editor/milestone-badges";

interface Option {
  id: string;
  text?: string | null;
  position: number;
  isSelected: boolean;
}

interface AnswerCardProps {
  id: string;
  text?: string | null;
  type: TFormItemType;
  options: Option[];
  textValue?: string | null;
  milestones?: SubcompetencyResult[0]["milestones"] | undefined;
  noBorder?: boolean;
}

/* todo add 'see previous answer flag'
 *  use discriminated union, add requirement for previous selectedOptionIds
 *
 */
export function AnswerCard({
  id,
  text,
  type,
  options,
  textValue,
  milestones,
  noBorder,
}: AnswerCardProps) {
  return (
    <Card id={id} className={cn(noBorder && "border-0")}>
      <CardContent className="p-4">
        <p className="mb-2 text-sm">{text}</p>

        {type === "WRITTEN" && (
          <p className="mt-2 rounded bg-gray-100 p-2 text-xs">
            {textValue || "No answer provided"}
          </p>
        )}

        {type === "SINGLE_CHOICE" && (
          <RadioGroup className="relative">
            {options
              .sort((a, b) => a.position - b.position)
              .map((o) => (
                <RadioGroupItem
                  indicatorClassName="top-[-1px] left-[-5%]"
                  disabled
                  key={o.id}
                  label={o.text || ""}
                  value={o.id}
                  checked={o.isSelected}
                />
              ))}
          </RadioGroup>
        )}
        {type === "MULTIPLE_CHOICE" && (
          <div className="space-y-2">
            {options
              .sort((a, b) => a.position - b.position)
              .map((o) => (
                <div
                  key={o.id}
                  className="flex flex-row items-center space-x-2"
                >
                  <Checkbox
                    noDisabledStyle
                    disabled
                    value={o.id}
                    checked={o.isSelected}
                  />
                  <Label>{o.text}</Label>
                </div>
              ))}
          </div>
        )}
        {milestones && (
          <div className="flex w-full flex-row items-center justify-end space-x-2">
            {milestones.map((m) => (
              <MilestoneBadge milestone={m} key={m.id} />
            ))}
          </div>
        )}
        {type === "WRITTEN" && textValue && (
          <div className="mt-2 border-t border-neutral-200 py-2 text-xs italic text-neutral-500">
            {textValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
