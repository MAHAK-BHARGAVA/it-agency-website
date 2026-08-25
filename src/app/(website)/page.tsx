import Hero from "@/components/home/Hero/Hero";
import About from "@/components/home/About/About";
import Services from "@/components/home/Services/Services";
import Portfolio from "@/components/home/Portfolio/Portfolio";
import Process from "@/components/sections/process/Process";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import FAQ from "@/components/sections/faq/FAQ";
import CTA from "@/components/sections/cta/CTA";
import TechStack from "@/components/home/TechStack/TechStack";

import { prisma } from "@/lib/prisma";

import { getServices } from "@/repositories/service.repository";
import { getPortfolio } from "@/repositories/portfolio.repository";
import { getTestimonials } from "@/repositories/testimonial.repository";
import { getFAQs } from "@/repositories/faq.repository";

export default async function Home() {
  const [
    services,
    portfolio,
    testimonials,
    faqs,
    heroData,
    aboutData,
  ] = await Promise.all([
    getServices(),
    getPortfolio(),
    getTestimonials(),
    getFAQs(),

    prisma.homeHero.findUnique({
      where: {
        id: 1,
      },
    }),

    prisma.homeAbout.findUnique({
      where: {
        id: 1,
      },
    }),
  ]);

  // Existing website content is used until admin saves HomeHero.
  const hero =
    heroData ?? {
      id: 1,

      badge: "Digital Agency",

      title: "Creative Digital Agency",

      description:
        "We build premium digital experiences that combine strategy, creativity and technology.",

      primaryButtonText: "Discover More",
      primaryButtonLink: "/about",

      secondaryButtonText: "Our Work",
      secondaryButtonLink: "/portfolio",

      // Your current Hero uses the enquiry form instead of this image.
      heroImage: "",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

  // Existing website content is used until admin saves HomeAbout.
  const about =
    aboutData ?? {
      id: 1,

      sectionTitle: "About Company",

      title: "We Create Digital Experiences",

      description:
        "We help businesses grow with premium web development, branding, UI/UX design and marketing solutions that combine creativity, strategy and technology.",

      experience: 15,

      image: "/assets/images/about/01.webp",

      featureOne: "Creative Design",
      featureTwo: "Development",
      featureThree: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

  return (
    <>
      <Hero
        services={services.map((service) => ({
          id: service.id,
          name: service.name,
        }))}
        hero={hero}
      />

      <About about={about} />

      <Services services={services} />

      <TechStack />

      <Portfolio portfolio={portfolio} />

      <Process />

      <Testimonials testimonials={testimonials} />

      <FAQ faqs={faqs} />

      <CTA />
    </>
  );
}