"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Start building and collaborating with your team.
        </p>
      </div>

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        className="mt-8 h-12 w-full gap-3 border-input bg-card font-semibold text-card-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="my-7 flex items-center gap-4">
        <Separator className="flex-1" />

        <span className="text-xs text-muted-foreground">or</span>

        <Separator className="flex-1" />
      </div>

      {/* Sign Up Form */}
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {/* Name */}
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
            className="h-11 border-input bg-card shadow-none"
          />
        </div>

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
            className="h-11 border-input bg-card shadow-none"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-11 border-input bg-card pr-11 shadow-none"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1.5 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
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
              className="h-11 border-input bg-card pr-11 shadow-none"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-1.5 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="h-12 w-full font-bold">
          Create account
        </Button>
      </form>

      {/* Legal */}
      <p className="mt-5 text-xs leading-5 text-muted-foreground">
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
      <p className="mt-7 text-center text-sm text-muted-foreground lg:hidden">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary hover:text-primary/80"
        >
          Sign in
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
