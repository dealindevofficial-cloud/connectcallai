import type { Metadata } from "next";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { IndustriesHub } from "@/components/industries/IndustriesHub";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.industries,
  description: pageDescriptions.industries,
  alternates: {
    canonical: "/industries",
  },
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
