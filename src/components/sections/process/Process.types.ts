import type { LucideIcon } from "lucide-react";

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};