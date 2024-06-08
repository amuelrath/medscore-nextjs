"use client";
import debounce from "debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { TFormRelate } from "@/db/types";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Lottie from "lottie-react";
import CLOUD_LOADING_LOOP from "public/icons/system-regular-84-cloud-black.json";
import CLOUD_DONE from "public/icons/system-regular-128-cloud-done-black.json";
import { cn } from "@/lib/utils";
import { saveForm } from "@/server/actions/forms/save-form";

export default function SaveFormButton() {
  const methods = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [changeQueue, setChangeQueue] = useState<TFormRelate[]>([]);
  const doneAnimationRef = useRef<any>(null);

  const handleSave = useCallback(async () => {
    if (changeQueue.length === 0) return;

    setLoading(true);
    try {
      const formData = changeQueue[changeQueue.length - 1];

      await saveForm(formData);
      setChangeQueue([]);
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setLoading(false);
    }
  }, [changeQueue]);

  const debouncedUpdateChangeQueue = useCallback(
    debounce((formData: TFormRelate) => {
      setChangeQueue((prevQueue) => [...prevQueue, formData]);
    }, 2000),
    [],
  );

  const watchedData = useWatch({
    control: methods.control,
    defaultValue: methods.getValues(),
  });

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      debouncedUpdateChangeQueue(watchedData as TFormRelate);
    }
  }, [watchedData, debouncedUpdateChangeQueue]);

  useEffect(() => {
    if (changeQueue.length > 0 && !loading) {
      handleSave();
    }
  }, [changeQueue, loading, handleSave]);

  useEffect(() => {
    if (!loading && doneAnimationRef.current) {
      doneAnimationRef.current.play();
    }
  }, [loading]);

  return (
    <Button
      type="submit"
      disabled={loading}
      variant={"icon"}
      className={cn("text-primary")}
      size={"icon"}
      onClick={handleSave}
    >
      {loading ? (
        <Lottie
          animationData={CLOUD_LOADING_LOOP}
          loop
          autoplay
          style={{ width: 18, height: 18 }}
        />
      ) : (
        <Lottie
          lottieRef={doneAnimationRef}
          animationData={CLOUD_DONE}
          loop={false}
          autoplay
          style={{ width: 18, height: 18 }}
        />
      )}
    </Button>
  );
}
