import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Legal Notice | Zoomli", description: "Important information about Zoomli's website, content and marketplace role." };
const sections: LegalSection[] = [
  { title: "1. Website operator", paragraphs: ["Zoomli is a trading name operating from Melbourne, Victoria, Australia. Zoomli currently provides a vehicle discovery, listing and reservation-request website. No registered company number or street address is represented on this page."] },
  { title: "2. Marketplace information", paragraphs: ["We take reasonable care with website content, but listings may be supplied by vehicle owners and can change. Images may be illustrative. Confirm important vehicle, pricing, eligibility and availability information before relying on it or taking possession of a vehicle."] },
  { title: "3. Intellectual property", paragraphs: ["The Zoomli name, interface, original copy and site design are owned by or licensed to Zoomli. Vehicle owners retain responsibility for listing material they submit and grant Zoomli permission to display it for operating and promoting the service. Third-party marks remain the property of their owners."] },
  { title: "4. External services", paragraphs: ["Links, maps and social platforms are provided for convenience. Zoomli does not control external services and their availability, content, security and privacy practices are governed by their providers."] },
  { title: "5. Reporting concerns", paragraphs: ["Contact us to report inaccurate listings, intellectual-property concerns, security issues or unlawful content. Include the relevant page, a clear explanation and your contact details so we can assess the request."] },
];
export default function LegalNoticePage() { return <LegalPage eyebrow="Important information" title="Legal Notice" summary="Who operates this website, Zoomli's marketplace role, and how website content may be used." updated="17 August 2026" sections={sections} />; }
