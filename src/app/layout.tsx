import "./globals.css";

import { JsonLd } from "@/components/JsonLd";
import { Manrope, Raleway } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer/Footer";

import { getFooterData } from "@/repositories/footer.repository";

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
  const footerData = await getFooterData();

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${raleway.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ABC Technologies",
            url: process.env.NEXT_PUBLIC_SITE_URL,
          }}
        />

        <Navbar />

        {children}

        <Footer data={footerData} />
      </body>
    </html>
  );
}