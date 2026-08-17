import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/brand";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of use" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/legal-notice", label: "Legal notice" },
  { href: "/accessibility", label: "Accessibility" },
];

export default function LegalPage({ eyebrow, title, summary, updated, sections }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="legal-page">
        <header className="legal-hero bg-section">
          <div className="container legal-hero-inner">
            <p className="legal-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="legal-summary">{summary}</p>
            <p className="legal-updated">Effective and last updated: {updated}</p>
          </div>
        </header>

        <div className="container legal-layout">
          <nav className="legal-nav" aria-label="Legal pages">
            <p>Zoomli legal</p>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          <article className="legal-content">
            <div className="legal-note" role="note">
              This information explains Zoomli&apos;s current website and reservation service. Vehicle-specific hire, payment, licence, deposit, insurance and damage terms are confirmed separately before a vehicle is supplied.
            </div>
            {sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && (
                  <ul>
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}
            <section>
              <h2>Contact Zoomli</h2>
              <p>
                Questions, accessibility requests and privacy enquiries can be sent to{" "}
                <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. Zoomli operates from {BRAND.location}.
              </p>
            </section>
            <div className="legal-review-note">
              These pages describe the current Zoomli MVP and should be reviewed by the business and an Australian legal adviser whenever services or commercial terms change.
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
