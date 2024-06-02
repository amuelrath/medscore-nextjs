import FormViewerSection from "@/components/(admin)/forms/viewer";
import { getAllForms } from "@/server/actions/forms/get-all-forms";
// TODO cache this
export default async function SecureEvaluationsHomePage() {
  const forms = await getAllForms(
    process.env.NEXT_PUBLIC_DEV_USER_ID! as string,
  );
  return <FormViewerSection forms={forms} />;
}

