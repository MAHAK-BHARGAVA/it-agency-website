import type { getFooterData } from "@/repositories/footer.repository";

export type FooterData = Awaited<
  ReturnType<typeof getFooterData>
>;

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumnType = {
  title: string;
  links: FooterLink[];
};