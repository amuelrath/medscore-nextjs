"use client";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import { cn } from "@/lib/utils";
import REPORT_ICON from "public/icons/wired-flat-2450-invoice-general.json";

export function ReportButton() {
  return <LottieIconButton label="Report" icon={REPORT_ICON} />;
}
