import PublishedEvaluationViewer from "./_components/PublishedEvaluationViewer";
import { fetchPublishedEvaluations } from "@/components/_actions";

export default async function PublishedPage() {
  const publishedEvaluations = await fetchPublishedEvaluations();

  return (
    <PublishedEvaluationViewer publishedEvaluations={publishedEvaluations} />
  );
}
