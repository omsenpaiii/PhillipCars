import type { Metadata } from "next";
import { DM_Sans, Epilogue } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  variable: "--font-dm-sans",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://phillip-cars.vercel.app"),
  title: "Zoomli | Premium Car Hire in Melbourne",
  description: "Premium car hire, rent-to-own options, and vehicle listings across Melbourne and Victoria, Australia.",
  applicationName: "Zoomli",
  openGraph: {
    title: "Zoomli | Premium Car Hire in Melbourne",
    description: "Search quality vehicles and plan your next Melbourne journey with Zoomli.",
    type: "website",
    locale: "en_AU",
  },
  icons: {
    icon: "/images/favicon.png",
  }
};

import MagicCursor from "@/components/MagicCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${dmSans.variable} ${epilogue.variable}`}>
      <body>
        <MagicCursor />
        {children}
      </body>
    </html>
  );
}
