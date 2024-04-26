import * as Dialog from "@/components/ui/dialog";
import QUESTIONAIRE_ICON from "public/icons/wired-flat-967-questionnaire.json";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import AdministerDialog from "../dialogs/administer-form-dialog";

export function AdministerButton() {
  return (
    <Dialog.Dialog>
      <AdministerDialog />
      <Dialog.DialogTrigger>
        <LottieIconButton icon={QUESTIONAIRE_ICON} label="Administer" />
      </Dialog.DialogTrigger>
    </Dialog.Dialog>
  );
}
