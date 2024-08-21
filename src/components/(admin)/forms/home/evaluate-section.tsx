import { IncomingRequests } from "@/components/(admin)/forms/home/incoming-requests";
import { OutgoingRequests } from "@/components/(admin)/forms/home/outgoing-requests";

export function EvaluateSection() {
  return (
    <>
      <IncomingRequests />
      <OutgoingRequests />
    </>
  );
}
