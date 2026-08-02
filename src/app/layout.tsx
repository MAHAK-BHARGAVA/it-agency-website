import "./globals.css";
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
    <html lang="en">
      <body
        className={`${manrope.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}