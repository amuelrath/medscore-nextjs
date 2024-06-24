import { useState } from "react";

interface PendingChange {
  index: number;
  newValue: string;
  oldValue: string;
}

interface UseDataIntegrityDialogProps {
  isAdministered: boolean;
}

export const useDataIntegrityDialog = ({
  isAdministered,
}: UseDataIntegrityDialogProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(
    null,
  );

  const handleValueChange = (
    index: number,
    newValue: string,
    oldValue: string,
  ) => {
    if (isAdministered) {
      setShowWarning(true);
      setPendingChange({ index, newValue, oldValue });
    }
    return !isAdministered;
  };

  const handleConfirmEdit = () => {
    setShowWarning(false);
    const result = pendingChange;
    setPendingChange(null);
    return result;
  };

  const handleCancelEdit = () => {
    setShowWarning(false);
    setPendingChange(null);
  };

  return {
    showWarning,
    setShowWarning,
    pendingChange,
    handleValueChange,
    handleConfirmEdit,
    handleCancelEdit,
  };
};
