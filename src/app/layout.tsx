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
  title: "Novaride - Car Rental HTML Template",
  description: "Experience the ease and convenience of renting a car with Novaride. We offer a wide range of vehicles to suit your needs.",
  icons: {
    icon: "/images/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${epilogue.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
