import "../globals.css";

import { JsonLd } from "@/components/JsonLd";
import { Manrope, Raleway } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer/Footer";

import { getFooterData } from "@/repositories/footer.repository";
import { prisma } from "@/lib/prisma";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-primary",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-secondary",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerData, settings] = await Promise.all([
    getFooterData(),

    prisma.siteSetting.findUnique({
      where: {
        id: 1,
      },
    }),
  ]);

  const siteSettings =
    settings ?? {
      companyName: "ABC Technologies",

      logo: "/assets/images/logo/01.svg",
      whiteLogo: "/assets/images/logo/01.svg",
      favicon: null,

      phone: "",
      email: "",
      address: "",

      facebook: null,
      instagram: null,
      linkedin: null,
      twitter: null,
      youtube: null,

      salesEmail: null,
      seoEmail: null,
      aiEmail: null,
      supportEmail: null,
      mediaEmail: null,

      footerCopyright: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${raleway.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteSettings.companyName,
            url: process.env.NEXT_PUBLIC_SITE_URL,
          }}
        />

        <Navbar settings={siteSettings} />

        {children}

        <Footer
          data={footerData}
          settings={siteSettings}
        />
      </body>
    </html>
  );
}