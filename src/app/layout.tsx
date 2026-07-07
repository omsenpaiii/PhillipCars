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
  title: "PhillipCars - Premium Car Rent & Rent-to-Own",
  description: "Experience the ease and convenience of renting or owning a car with PhillipCars. We offer a wide range of vehicles to suit your needs.",
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
    <html lang="en" className={`${dmSans.variable} ${epilogue.variable}`}>
      <body>
        <MagicCursor />
        {children}
      </body>
    </html>
  );
}
