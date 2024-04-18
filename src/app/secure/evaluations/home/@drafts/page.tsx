import EvaluationsViewer from "./_components/EvaluationsViewer";
import { fetchDraftEvaluations } from "@/components/_actions";
export default async function SecureEvaluationsHomePage() {
  const unpublishedEvaluations = await fetchDraftEvaluations();

  return <EvaluationsViewer evaluations={unpublishedEvaluations} />;
}
