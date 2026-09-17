import { AuthShell } from "@/components/auth/auth-shell";
import { AuthShowcase } from "@/components/auth/auth-showcase";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up" showcase={<AuthShowcase mode="sign-up" />}>
      <SignUpForm />
    </AuthShell>
  );
}
