import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { ServiceLanding } from "@/components/services/ServiceLanding";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";
import { getServiceBySlug, getServiceCanonicalUrl, services } from "@/lib/services-data";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: pageTitles.serviceNotFound,
      description: pageDescriptions.notFound,
    };
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin ? getServiceCanonicalUrl(siteOrigin, service) : undefined;
  const title = pageTitles.service(service.seoTitle);

  return {
    title,
    description: service.metaDescription,
    keywords: [service.primaryKeyword, ...service.secondaryKeywords],
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title,
      description: service.metaDescription,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${service.label} from Connect Call AI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin ? getServiceCanonicalUrl(siteOrigin, service) : undefined;

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <ServiceLanding service={service} canonicalUrl={canonicalUrl} />
    </div>
  );
}
