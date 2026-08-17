import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PasswordResetForm } from "@/components/PasswordResetForm";
export const metadata: Metadata = { title: "Forgot password | Zoomli", robots: { index: false } };
export default function ForgotPasswordPage() { return <><Header /><main className="auth-section reset-page"><PasswordResetForm /></main><Footer /></>; }
