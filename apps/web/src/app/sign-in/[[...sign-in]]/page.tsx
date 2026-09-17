import { AuthShell } from "@/components/auth/auth-shell";
import { AuthShowcase } from "@/components/auth/auth-showcase";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell mode="sign-in" showcase={<AuthShowcase mode="sign-in" />}>
      <SignInForm />
    </AuthShell>
  );
}
