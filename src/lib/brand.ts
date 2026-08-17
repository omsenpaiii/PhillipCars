export const BRAND = {
  name: "Zoomli",
  legalName: "Zoomli",
  location: "Melbourne, Victoria, Australia",
  supportEmail: "support@phillipcars.com",
  futureUrl: "https://www.zoomli.com.au",
} as const;

export function getSiteUrl(): string {
  return (process.env.SITE_URL || "https://phillip-cars.vercel.app").replace(/\/$/, "");
}
