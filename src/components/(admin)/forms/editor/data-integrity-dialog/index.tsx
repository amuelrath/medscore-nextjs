import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DataIntegrityAlertDialogProps {
  showWarning: boolean;
  setShowWarning: (val: boolean) => void;
  handleCancelEdit: () => void;
  handleConfirmEdit: () => void;
}

export function DataIntegrityAlert({
  showWarning,
  setShowWarning,
  handleConfirmEdit,
  handleCancelEdit,
}: DataIntegrityAlertDialogProps) {
  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning: Data Integrity Risk</AlertDialogTitle>
          <AlertDialogDescription>
            This form already has responses. Changing points will result in a
            loss of data integrity. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleCancelEdit}>
            Cancel
          </AlertDialogAction>
          <AlertDialogAction onClick={handleConfirmEdit}>
            Confirm Edit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
