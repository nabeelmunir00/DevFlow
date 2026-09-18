import type { Metadata } from "next";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your DevFlow account.",
};

export default function SignInPage() {
  return <SignInForm />;
}
