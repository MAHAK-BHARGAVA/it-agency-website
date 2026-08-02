// Standalone Service page — /services/seo (just the service alone, no city/state). This is actually a core page type from the PRD (Section 11)

// generateMetadata → handles "optimizing page titles, headings, meta descriptions" for every dynamic page automatically
// generateStaticParams → handles "making your website load quickly" by pre-building pages instead of generating them on-demand every time

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ services: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { services } = await params;
  const service = await prisma.service.findUnique({
    where: { slug: services },
  });
  if (!service) return { title: "Service Not Found" };

  return buildMetadata({
    title: service.metaTitle || `${service.name} Services | ABC Technologies`,
    description: service.metaDescription || service.description.slice(0, 160),
    path: `/services/${service.slug}`,
    image: service.ogImage || undefined,
  });
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany();
  return services.map((service) => ({ services: service.slug }));
}

export default async function ServicePage({ params }: Props) {
  const { services } = await params;

  const service = await prisma.service.findUnique({
    where: { slug: services },
    include: {
      serviceCities: { include: { city: true }, take: 5 },
      testimonials: true,
      faqs: true,
    },
  });

  if (!service) {
    notFound();
  }

  let displayTestimonials = service.testimonials

if (displayTestimonials.length === 0) {
  displayTestimonials = await prisma.testimonial.findMany({
    where: {
      services: { none: {} },
      cities: { none: {} },
      industries: { none: {} },
    },
    take: 3,
  })
}

  return (
    <main style={{ padding: "2rem" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: "/services",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: service.name,
              item: `/services/${service.slug}`,
            },
          ],
        }}
      />
      {service.faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      )}
      <h1>{service.name}</h1>
      <p>{service.description}</p>

      {service.serviceCities.length > 0 && (
        <>
          <h2>Available in these cities</h2>
          <ul>
            {service.serviceCities.map((sc) => (
              <li key={sc.id}>
                <a href={`/services/${service.slug}/${sc.city.slug}`}>
                  {service.name} in {sc.city.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {service.faqs.length > 0 && (
        <>
          <h2>FAQs</h2>
          {service.faqs.map((faq) => (
            <div key={faq.id}>
              <p>
                <strong>{faq.question}</strong>
              </p>
              <p>{faq.answer}</p>
            </div>
          ))}
        </>
      )}

     {displayTestimonials.length > 0 && (
  <>
    <h2>Testimonials</h2>
    {displayTestimonials.map((t) => (
      <p key={t.id}>&ldquo;{t.quote}&rdquo; — {t.clientName}</p>
    ))}
  </>
)}
    </main>
  );
}
