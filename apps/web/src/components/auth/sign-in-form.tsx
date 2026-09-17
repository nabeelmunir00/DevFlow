"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignInForm() {
  const router = useRouter();

  const { signIn, errors, fetchStatus } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);

    const emailAddress = String(formData.get("email") ?? "").trim();

    const password = String(formData.get("password") ?? "");

    if (!emailAddress || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
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

      return;
    }

    if (signIn.status === "needs_second_factor") {
      setFormError("Your account requires additional verification.");
      return;
    }

    if (signIn.status === "needs_client_trust") {
      setFormError("This device requires additional verification.");
      return;
    }

    setFormError("Sign in could not be completed. Please try again.");
  }

  async function handleGoogleSignIn() {
    setFormError(null);

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/",
    });

    if (error) {
      console.error("Google sign in error:", error);

      setFormError("Google sign in failed. Please try again.");
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Sign in to DevFlow
        </h2>

        <p className="mt-2 text-base text-muted-foreground">
          Keep your team&apos;s work moving.
        </p>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
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

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email address
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className="h-12 border-input bg-card text-base font-normal shadow-none md:text-base"
          />

          {errors.fields.identifier && (
            <p className="text-sm text-destructive">
              {errors.fields.identifier.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </Label>

          <div className="relative mt-2">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
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
            <p className="mt-2 text-sm text-destructive">
              {errors.fields.password.message}
            </p>
          )}

          <div className="mt-2.5 text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {formError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Legal */}
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        By continuing, you agree to the{" "}
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

      {/* Mobile */}
      <p className="mt-7 text-center text-sm text-muted-foreground sm:hidden">
        New to DevFlow?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:text-primary/80"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

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
