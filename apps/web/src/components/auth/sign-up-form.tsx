"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignUpForm() {
  const router = useRouter();

  const { signUp, errors, fetchStatus } = useSignUp();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  /* =========================================================
     CREATE ACCOUNT
  ========================================================= */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);

    const formData = new FormData(event.currentTarget);

    const fullName = String(formData.get("name") ?? "").trim();

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    /* -------------------------
       Client Validation
    ------------------------- */

    if (!fullName || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    /* -------------------------
       Split Full Name
    ------------------------- */

    const nameParts = fullName.split(/\s+/).filter(Boolean);

    const firstName = nameParts[0];

    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

    /* -------------------------
       Create Clerk Sign Up
    ------------------------- */

    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      console.error("Sign up error:", error);
      return;
    }

    /* -------------------------
       Sign Up Already Complete
    ------------------------- */

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    /* -------------------------
       Send Email OTP
    ------------------------- */

    const { error: verificationError } =
      await signUp.verifications.sendEmailCode();

    if (verificationError) {
      console.error("Email verification error:", verificationError);

      setFormError("We couldn't send the verification code. Please try again.");

      return;
    }

    /* -------------------------
       Open Verification Page
    ------------------------- */

    router.push("/verify-email");
  }

  /* =========================================================
     FINALIZE SIGN UP
  ========================================================= */

  async function finalizeSignUp() {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log("Clerk session task:", session.currentTask);

          return;
        }

        const url = decorateUrl("/");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      },
    });
  }

  /* =========================================================
     GOOGLE SIGN UP
  ========================================================= */

  async function handleGoogleSignUp() {
    setFormError(null);

    const { error } = await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/",
    });

    if (error) {
      console.error("Google sign up error:", error);

      setFormError("Google sign up failed. Please try again.");
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Create your account
        </h2>

        <p className="mt-2 text-base text-muted-foreground">
          Start building and collaborating with your team.
        </p>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={handleGoogleSignUp}
        className="mt-8 h-12 w-full gap-3 border-input bg-card text-base font-medium text-card-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>

      {/* Separator */}
      <div className="my-7 flex items-center gap-4">
        <Separator className="flex-1" />

        <span className="text-sm text-muted-foreground">or</span>

        <Separator className="flex-1" />
      </div>

      {/* Sign Up Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-muted-foreground"
          >
            Full name
          </Label>

          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            disabled={isLoading}
            className="h-12 border-input bg-card text-base font-normal shadow-none md:text-base"
          />

          {errors.fields.firstName && (
            <p className="text-sm text-destructive">
              {errors.fields.firstName.message}
            </p>
          )}

          {errors.fields.lastName && (
            <p className="text-sm text-destructive">
              {errors.fields.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="signup-email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email address
          </Label>

          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className="h-12 border-input bg-card text-base font-normal shadow-none md:text-base"
          />

          {errors.fields.emailAddress && (
            <p className="text-sm text-destructive">
              {errors.fields.emailAddress.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="signup-password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              disabled={isLoading}
              className="h-12 border-input bg-card pr-11 text-base font-normal shadow-none md:text-base"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </Button>
          </div>

          {errors.fields.password && (
            <p className="text-sm text-destructive">
              {errors.fields.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-sm font-medium text-muted-foreground"
          >
            Confirm password
          </Label>

          <div className="relative">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              disabled={isLoading}
              className="h-12 border-input bg-card pr-11 text-base font-normal shadow-none md:text-base"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* General Error */}
        {formError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {formError}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Legal */}
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        By creating an account, you agree to the{" "}
        <Link
          href="/terms"
          className="font-medium text-primary hover:text-primary/80"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-primary hover:text-primary/80"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Mobile Sign In */}
      <p className="mt-7 text-center text-sm text-muted-foreground sm:hidden">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.55l3.35-2.62Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.95 14.7 2 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  );
}
