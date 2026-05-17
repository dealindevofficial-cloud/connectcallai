type FaqItem = {
  question: string;
  answer: string;
};

type JsonLdFaqProps = {
  faqs: FaqItem[];
};

export function JsonLdFaq({ faqs }: JsonLdFaqProps) {
  if (faqs.length === 0) {
    return null;
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Safe: JSON generated from structured admin fields.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
