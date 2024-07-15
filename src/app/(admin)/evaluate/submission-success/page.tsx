import { DoneIllustration } from "@/components/illustrations/done-illustration";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// todo add new response button functionality
export default function SubmissionSuccessPage() {
  return (
    <div className="grid h-full w-full grid-cols-2 place-items-center gap-4 px-4">
      <div className="col-span-1 flex flex-col items-center justify-center">
        <p className="mb-1 text-4xl font-semibold">
          Your response was recorded
        </p>
        <p>Would you like to submit another response?</p>
        <div className="mt-4 flex flex-row items-center justify-center space-x-2">
          <Button>New Response</Button>
          <Link href={"/evaluate"}>
            <Button variant="link">Return home</Button>
          </Link>
        </div>
      </div>
      <div className="col-span-1 mt-12">
        <DoneIllustration />
      </div>
    </div>
  );
}
