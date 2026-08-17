import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Accessibility | Zoomli", description: "Zoomli's accessibility commitment and support options." };
const sections: LegalSection[] = [
  { title: "1. Our commitment", paragraphs: ["Zoomli aims to provide an inclusive website that can be perceived, understood, navigated and used by as many people as possible. We use semantic structure, keyboard-accessible controls, visible focus states, descriptive labels, responsive layouts and reduced-motion support where practical."] },
  { title: "2. Supported use", items: ["Navigate main links, forms and interactive controls with a keyboard.", "Zoom browser text and page content without losing essential information.", "Use current screen readers with labelled form controls and status messages.", "Request a policy or support response in a more accessible format."] },
  { title: "3. Known limitations", paragraphs: ["Some third-party maps, social platforms, uploaded vehicle images or legacy template elements may not provide the same level of accessibility as Zoomli-controlled content. We continue to improve these areas and provide an alternative where reasonably possible."] },
  { title: "4. Feedback and assistance", paragraphs: ["Tell us what page or task caused difficulty, the browser or assistive technology used, and the format or outcome you need. We will respond with practical assistance and use the feedback to prioritise improvements."] },
];
export default function AccessibilityPage() { return <LegalPage eyebrow="Access for everyone" title="Accessibility" summary="How Zoomli supports accessible browsing, forms and account journeys—and how to request help." updated="17 August 2026" sections={sections} />; }
