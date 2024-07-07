import Lottie from "lottie-react";
import CLOUD_LOADING_LOOP from "public/icons/system-regular-84-cloud-black.json";
import CLOUD_DONE from "public/icons/system-regular-128-cloud-done-black.json";

export function SaveFormButton({ isSaving }: { isSaving: boolean }) {
  return (
    <>
      {isSaving ? (
        <Lottie
          animationData={CLOUD_LOADING_LOOP}
          loop
          autoplay
          style={{ width: 16, height: 16 }}
        />
      ) : (
        <Lottie
          animationData={CLOUD_DONE}
          loop={false}
          autoplay
          style={{ width: 16, height: 16 }}
        />
      )}
    </>
  );
}
