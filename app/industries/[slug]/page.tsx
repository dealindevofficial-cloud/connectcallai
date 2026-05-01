import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { IndustryLanding } from "@/components/industries/IndustryLanding";
import { getIndustryBySlug, industries } from "@/lib/industries-data";

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry Not Found | CCAI",
    };
  }

  return {
    title: `AI Calling for ${industry.name} | AI Phone Agent for ${industry.name} | CCAI`,
    description: industry.longDescription,
    keywords: [...industry.seoKeywords],
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <IndustryLanding industry={industry} />
    </div>
  );
}
