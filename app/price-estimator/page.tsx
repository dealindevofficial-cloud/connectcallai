import type { Metadata } from "next";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { FinalCta } from "@/components/landing/FinalCta";
import { PriceEstimator } from "@/components/pricing/PriceEstimator";

export const metadata: Metadata = {
  title: "Price Estimator | CCAI",
  description:
    "Estimate monthly AI call handling pricing using call volume, duration, and staffing assumptions.",
};

export default function PriceEstimatorPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <PriceEstimator />
      <FinalCta />
    </div>
  );
}
