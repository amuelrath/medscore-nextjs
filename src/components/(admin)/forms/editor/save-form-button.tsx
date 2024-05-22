"use client";
import debounce from "debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { TFormRelate } from "@/db/types";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { isEqual } from "lodash";
import { Player } from "@lottiefiles/react-lottie-player";
import CLOUD_LOADING_LOOP from "public/icons/system-regular-84-cloud-black.json";
import CLOUD_DONE from "public/icons/system-regular-128-cloud-done-black.json";
import { cn } from "@/lib/utils";
import { saveForm } from "@/server/actions/forms/save-form";

export default function SaveFormButton() {
  const methods = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [changeQueue, setChangeQueue] = useState<TFormRelate[]>([]);
  const doneAnimationRef = useRef<Player>(null);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const formData = changeQueue[changeQueue.length - 1];
      //console.log("Saving form data:", formData);
      await saveForm(formData);
      // console.log("Form saved successfully");
      setChangeQueue([]);
    } catch (error) {
      //console.error("Error saving form:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setChangeQueue, changeQueue]);

  const debouncedSave = useCallback(
    (formData: TFormRelate) => {
      debounce(() => {
        //console.log("Debounced save triggered");
        setChangeQueue((prevQueue) => {
          const lastIndex = prevQueue.length - 1;
          if (lastIndex >= 0 && isEqual(prevQueue[lastIndex], formData)) {
            // console.log("No changes detected, skipping save");
            return prevQueue;
          }
          //console.log("Changes detected, adding to change queue");
          return [...prevQueue, formData];
        });
      }, 1000)();
    },
    [setChangeQueue],
  );

  const watchedData = useWatch({
    control: methods.control,
    defaultValue: methods.formState.defaultValues,
  });

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      //console.log("Form is dirty, triggering debounced save");
      debouncedSave(watchedData as TFormRelate);
    }
  }, [watchedData, debouncedSave]);

  useEffect(() => {
    if (changeQueue.length > 0) {
      // console.log("Attempting to save...");
      handleSave().then((r) => console.log("Saved", r));
    }
  }, [loading, changeQueue, handleSave]);

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
        <Player
          src={CLOUD_LOADING_LOOP}
          loop
          autoplay
          style={{ width: 18, height: 18 }}
        />
      ) : (
        <Player
          ref={doneAnimationRef}
          src={CLOUD_DONE}
          loop={false}
          autoplay
          style={{ width: 18, height: 18 }}
          onEvent={(event) => {
            if (event === "complete") {
              doneAnimationRef.current?.pause();
            }
          }}
        />
      )}
    </Button>
  );
}
