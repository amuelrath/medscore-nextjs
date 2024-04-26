"use client";
import { cn } from "@/lib/utils";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import MICROSCOPE_ICON from "public/icons/wired-flat-1229-microscope1.json";

export function AnalysisButton() {
  return <LottieIconButton label="Analyze" icon={MICROSCOPE_ICON} />;
}
