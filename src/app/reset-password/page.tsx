import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PasswordResetForm } from "@/components/PasswordResetForm";
export const metadata: Metadata = { title: "Reset password | Zoomli", robots: { index: false }, referrer: "no-referrer" };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const { token } = await searchParams; return <><Header /><main className="auth-section reset-page"><PasswordResetForm token={token} /></main><Footer /></>; }
