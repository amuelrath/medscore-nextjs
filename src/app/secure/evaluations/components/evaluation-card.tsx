import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import pc from "public/pc.png";
import mk from "public/mk.png";
import sbp from "public/sbp.png";
import ics from "public/ics.png";
import p from "public/p.png";
import pbli from "public/pbli.png";

// there is surely a better way of getting this type
type EvaluationWithProgram = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  programId: string | null;
  creatorId: string | null;
  program: {
    id: string;
    name: string;
    description: string | null;
    specialtyId: string | null;
  } | null;
};

export default function EvaluationCard({
  evaluation,
}: {
  evaluation: EvaluationWithProgram;
}) {
  return (
    <Card className="col-span-1 h-52 hover:shadow-md transition-all flex flex-col justify-between p-2">
      <div>
        <h5 className="text-md font-semibold">{evaluation.title}</h5>
        <p className="text-sm text-gray-500 italic">
          {/* todo turn this into a link that allows the user to view that program */}
          {evaluation.program?.name}
        </p>
        <hr className="mt-2" />
      </div>
      <CardDescription>
        {evaluation.description || "no description provided"}
      </CardDescription>
      <div>
        <hr />
        <div className="flex flex-row justify-start mt-2">
          <IconTooltip label="Patient Care">
            <Image src={pc} alt={""} className="w-7" />
          </IconTooltip>
          <IconTooltip label="Medical Knowledge">
            <Image src={mk} alt={""} className="w-7" />
          </IconTooltip>
          <IconTooltip label="Systems-Based Practice">
            <Image src={sbp} alt={""} className="w-7" />
          </IconTooltip>
          <IconTooltip label="Interpersonal Communication Skills">
            <Image src={ics} alt={""} className="w-7" />
          </IconTooltip>
          <IconTooltip label="Professionalism">
            <Image src={p} alt={""} className="w-7" />
          </IconTooltip>
          <IconTooltip label="Practice-Based Learning and Improvement">
            <Image src={pbli} alt={""} className="w-7" />
          </IconTooltip>
        </div>
      </div>
    </Card>
  );
}

function IconTooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
