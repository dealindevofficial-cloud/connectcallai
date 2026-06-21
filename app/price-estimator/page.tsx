import type { Metadata } from "next";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { FinalCta } from "@/components/landing/FinalCta";
import { PriceEstimator } from "@/components/pricing/PriceEstimator";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.pricing,
  description: pageDescriptions.pricing,
  alternates: {
    canonical: "/price-estimator",
  },
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
