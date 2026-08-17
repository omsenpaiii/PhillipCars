import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Zoomli",
  description: "How Zoomli collects, uses, stores and protects personal information in Australia.",
};

const sections: LegalSection[] = [
  {
    title: "1. About this policy",
    paragraphs: [
      "Zoomli is a Melbourne-based vehicle marketplace and reservation service. This policy explains how we manage personal information when you browse our website, create an account, list a vehicle, request a reservation, contact us or subscribe to updates.",
      "We aim to handle personal information consistently with the Privacy Act 1988 (Cth) and the Australian Privacy Principles where they apply to us.",
    ],
  },
  {
    title: "2. Information we collect",
    items: [
      "Account information such as your name, email address, Australian mobile number and securely hashed password.",
      "Reservation information such as vehicle, pickup and return locations, dates, reservation status and calculated price.",
      "Vehicle-listing information supplied by owners, including vehicle details, features, rates and uploaded images.",
      "Messages and contact details you send when requesting support, access, correction or making a complaint.",
      "Technical information needed to operate and secure the service, including session cookies, IP-derived security signals, device/browser information and server logs.",
    ],
  },
  {
    title: "3. How we collect and use information",
    paragraphs: [
      "We collect information directly from forms you submit and automatically when our systems provide or secure the service. We use it to create and protect accounts, show relevant vehicles, process reservation requests, manage listings, provide support, prevent misuse, send essential account emails and comply with legal obligations.",
      "We do not sell personal information. We use contact details for marketing only where permitted and provide a way to opt out of marketing communications.",
    ],
  },
  {
    title: "4. Service providers and overseas processing",
    paragraphs: [
      "Zoomli uses specialist providers including Vercel for hosting, Supabase for database and image storage, Resend for transactional email, and Google for embedded maps. These providers may process information in Australia or overseas under their own security and privacy commitments.",
      "We may also disclose information where required by law, to protect users or the service, or as part of a business transfer subject to appropriate safeguards.",
    ],
  },
  {
    title: "5. Cookies, links and embedded services",
    paragraphs: [
      "We use an essential, HTTP-only session cookie to keep signed-in users authenticated. Embedded maps and links to external services may allow those providers to collect technical information under their own policies. You can block non-essential browser storage, but blocking the session cookie prevents account features from working.",
    ],
  },
  {
    title: "6. Security and retention",
    paragraphs: [
      "We use access controls, password hashing, signed sessions, expiring single-use reset links and restricted database access. No internet service is completely risk-free, so users should choose a unique password and contact us if they suspect unauthorised access.",
      "We retain information only while it is reasonably required for the purposes described above, dispute resolution, fraud prevention, security, record keeping or applicable law. Information that is no longer required is deleted or de-identified where reasonably practicable.",
    ],
  },
  {
    title: "7. Access, correction and complaints",
    paragraphs: [
      "You may ask for access to personal information we hold about you or request a correction. We may need to verify your identity and may decline a request where permitted by law, explaining why where appropriate.",
      "Send privacy complaints to our support email with enough information for us to investigate. We aim to acknowledge complaints promptly and provide an outcome within 30 days. If you remain dissatisfied, you may contact the Office of the Australian Information Commissioner at oaic.gov.au.",
    ],
  },
  {
    title: "8. Changes to this policy",
    paragraphs: [
      "We may update this policy when our services or legal obligations change. The current version and effective date will always appear on this page. Material changes will be highlighted through the website or another reasonable channel.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Your information" title="Privacy Policy" summary="A plain-English guide to what Zoomli collects, why we use it, who helps us operate the service, and the choices available to you." updated="17 August 2026" sections={sections} />;
}
