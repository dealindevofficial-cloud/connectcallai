import { IndustryBenefits } from "@/components/industries/IndustryBenefits";
import { IndustryDemo } from "@/components/industries/IndustryDemo";
import { IndustryFaqs } from "@/components/industries/IndustryFaqs";
import { IndustryFinalCta } from "@/components/industries/IndustryFinalCta";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { IndustryProblems } from "@/components/industries/IndustryProblems";
import { IndustrySolutions } from "@/components/industries/IndustrySolutions";
import { IndustryUseCases } from "@/components/industries/IndustryUseCases";
import type { Industry } from "@/lib/industries-data";

type IndustryLandingProps = {
  industry: Industry;
};

export function IndustryLanding({ industry }: IndustryLandingProps) {
  return (
    <main className="relative z-10 overflow-x-clip">
      <IndustryHero industry={industry} />

      <section className="landing-section bg-gradient-to-b from-transparent via-[#111969]/22 to-transparent">
        <IndustryProblems industry={industry} />
      </section>

      <section className="landing-section bg-gradient-to-b from-transparent via-[#0f1760]/28 to-transparent">
        <IndustrySolutions industry={industry} />
      </section>

      <section className="landing-section bg-gradient-to-b from-transparent via-[#101965]/25 to-transparent">
        <IndustryUseCases industry={industry} />
      </section>

      <section className="landing-section bg-gradient-to-b from-transparent via-[#0e145a]/26 to-transparent">
        <IndustryDemo industry={industry} />
      </section>

      <section className="landing-section bg-gradient-to-b from-transparent via-[#0f165f]/22 to-transparent">
        <IndustryBenefits industry={industry} />
      </section>

      <section className="landing-section bg-gradient-to-b from-transparent via-[#111969]/20 to-transparent">
        <IndustryFaqs industry={industry} />
      </section>

      <IndustryFinalCta industry={industry} />
    </main>
  );
}
