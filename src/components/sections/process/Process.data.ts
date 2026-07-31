import { Code2, Rocket, Search, Target } from "lucide-react";

import type { ProcessStep } from "./Process.types";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We begin by understanding your business, users, goals, and the problems your digital product needs to solve.",
    points: [
      "Requirement gathering",
      "Business analysis",
      "Competitor research",
    ],
    icon: Search,
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We transform research into a clear roadmap covering user experience, architecture, scope, and delivery.",
    points: [
      "Product roadmap",
      "UI/UX planning",
      "Technical architecture",
    ],
    icon: Target,
  },
  {
    number: "03",
    title: "Development",
    description:
      "Our team builds the product using scalable technology, clean code, and a quality-focused development process.",
    points: [
      "Frontend development",
      "Backend integration",
      "Testing and quality assurance",
    ],
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch & Growth",
    description:
      "We deploy, monitor, optimize, and support your product so it continues delivering value after launch.",
    points: [
      "Production deployment",
      "Performance optimization",
      "Maintenance and support",
    ],
    icon: Rocket,
  },
];