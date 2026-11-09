import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Admin Login | Alexander Bullo",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <LoginForm />
    </div>
  );
}
