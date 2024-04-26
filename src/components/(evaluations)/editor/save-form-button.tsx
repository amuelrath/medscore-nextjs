"use client";
import debounce from "debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { CloudUploadIcon, CloudIcon } from "lucide-react";
import { TFormRelate } from "@/db/types";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { isEqual } from "lodash";

// TODO: wire up to save action
export default function SaveFormButton() {
  const methods = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [changeQueue, setChangeQueue] = useState<TFormRelate[]>([]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = changeQueue[changeQueue.length - 1];
      // await saveForm(data)
      setChangeQueue([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback(
    debounce((formData: TFormRelate) => {
      setChangeQueue((prevQueue) => {
        const lastIndex = prevQueue.length - 1;
        if (lastIndex >= 0 && isEqual(prevQueue[lastIndex], formData)) {
          return prevQueue;
        }
        return [...prevQueue, formData];
      });
    }, 500),
    []
  );

  const watchedData = useWatch({
    control: methods.control,
    defaultValue: methods.formState.defaultValues,
  });

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      debouncedSave(watchedData as TFormRelate);
    }
  }, [watchedData]);

  useEffect(() => {
    if (!loading && changeQueue.length > 0) {
      handleSave();
    }
  }, [loading, changeQueue]);

  return (
    <Button
      type="submit"
      disabled={loading}
      variant={"icon"}
      size={"icon"}
      onClick={handleSave}
    >
      {loading ? (
        <CloudUploadIcon size={"1rem"} />
      ) : (
        <CloudIcon size={"1rem"} />
      )}
    </Button>
  );
}
