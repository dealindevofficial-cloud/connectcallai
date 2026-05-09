import type { Metadata } from "next";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { IndustriesHub } from "@/components/industries/IndustriesHub";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Explore AI calling agents by industry. Discover tailored solutions for real estate, restaurants, hospitals, and pet clinics.",
};

export default function IndustriesPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <IndustriesHub />
    </div>
  );
}
