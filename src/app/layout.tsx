import "./globals.css";
import { JsonLd } from '@/components/JsonLd'
import { Manrope, Raleway } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-primary",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-secondary",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
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
        {children}
      </body>
    </html>
  );
}
