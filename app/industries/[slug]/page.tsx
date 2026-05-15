import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { IndustryLanding } from "@/components/industries/IndustryLanding";
import { getIndustryBySlug, industries } from "@/lib/industries-data";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

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
      title: pageTitles.industryNotFound,
      description: pageDescriptions.notFound,
    };
  }

  const siteOrigin = getSiteOrigin();
  const docTitle = pageTitles.industry(industry.name);
  const path = `/industries/${industry.slug}`;

  return {
    title: docTitle,
    description: industry.shortDescription,
    keywords: [...industry.seoKeywords],
    alternates: siteOrigin ? { canonical: `${siteOrigin}${path}` } : undefined,
    openGraph: {
      title: docTitle,
      description: industry.shortDescription,
      type: "website",
      url: siteOrigin ? `${siteOrigin}${path}` : undefined,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `AI voice agents for ${industry.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: docTitle,
      description: industry.shortDescription,
      images: ["/opengraph-image"],
    },
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
