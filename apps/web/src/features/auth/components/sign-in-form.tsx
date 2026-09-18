"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignInForm() {
  return (
    <div className="w-full">
      {/* Top link */}

      {/* Heading */}
      <div>
        <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.035em] text-[#f5f7fa]">
          Sign in to DevFlow
        </h1>

        <p className="mt-2 text-[16px] text-[#929eae]">
          Keep your team&apos;s work moving.
        </p>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="mt-9 h-12 w-full border-white/[0.1] bg-[#111820] text-[15px] font-medium text-[#f4f7fb] shadow-none hover:bg-[#161e27] hover:text-white"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="my-7 flex items-center gap-4">
        <Separator className="flex-1 bg-white/[0.1]" />

        <span className="text-sm text-[#758191]">or</span>

        <Separator className="flex-1 bg-white/[0.1]" />
      </div>

      {/* Form */}
      <form className="space-y-5">
        {/* Email */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-normal text-[#c3cad4]">
            Email address
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nabeel@example.com"
            className="h-12 border-white/[0.11] bg-[#111820] px-4 text-[15px] text-[#f5f7fa] shadow-none placeholder:text-[#626f80] focus-visible:border-[#5865ff] focus-visible:ring-[#5865ff]/20"
          />
        </div>

        {/* Password */}
        <div className="space-y-2.5">
          <Label
            htmlFor="password"
            className="text-sm font-normal text-[#c3cad4]"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 border-white/[0.11] bg-[#111820] px-4 pr-12 text-[15px] text-[#f5f7fa] shadow-none placeholder:text-[#626f80] focus-visible:border-[#5865ff] focus-visible:ring-[#5865ff]/20"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Show password"
              className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 text-[#8591a1] hover:bg-transparent hover:text-white"
            >
              <Eye className="size-[18px]" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#6470ff] transition-colors hover:text-[#7c86ff]"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Sign in */}
        <Button
          type="submit"
          className="h-12 w-full bg-[#5865f2] text-[15px] font-medium text-white shadow-none hover:bg-[#6571f5]"
        >
          Sign in
        </Button>
      </form>

      {/* Legal */}
      <p className="mt-5 text-sm leading-6 text-[#778394]">
        By continuing, you agree to the{" "}
        <Link href="/terms" className="text-[#6470ff] hover:text-[#7c86ff]">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#6470ff] hover:text-[#7c86ff]">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Mobile signup */}
      <p className="mt-8 text-center text-sm text-[#8f9baa] lg:hidden">
        New to DevFlow?{" "}
        <Link href="/sign-up" className="font-medium text-[#6470ff]">
          Create account
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
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
        d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.55l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  );
}
