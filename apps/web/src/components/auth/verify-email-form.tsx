"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";

export function VerifyEmailForm() {
  const router = useRouter();

  const { signUp, errors, fetchStatus } = useSignUp();

  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  const emailAddress = signUp.emailAddress ?? "your email";

  /* =========================================================
     VERIFY EMAIL
  ========================================================= */

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);
    setResendMessage(null);

    if (code.length !== 6) {
      setFormError("Please enter the complete 6-digit code.");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      console.error("Email verification error:", error);
      return;
    }

    if (signUp.status === "complete") {
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

      return;
    }

    setFormError("Email verification could not be completed.");
  }

  /* =========================================================
     RESEND CODE
  ========================================================= */

  async function handleResendCode() {
    setFormError(null);
    setResendMessage(null);

    const { error } = await signUp.verifications.sendEmailCode();

    if (error) {
      console.error("Resend verification error:", error);

      setFormError("We couldn't resend the code. Please try again.");

      return;
    }

    setCode("");

    setResendMessage("A new verification code has been sent.");
  }

  /* =========================================================
     DIFFERENT EMAIL
  ========================================================= */

  function handleDifferentEmail() {
    router.push("/sign-up");
  }

  return (
    <Card className="w-full max-w-xl border-border bg-card shadow-none">
      <CardContent className="">
        {/* Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-xl border border-border bg-secondary sm:size-16">
          <Mail className="size-7 text-primary sm:size-9" strokeWidth={1.8} />
        </div>

        {/* Header */}
        <div className="mt-4 text-center sm:mt-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Verify your email
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-sm">
            Enter the 6-digit code sent to{" "}
            <span className="break-all text-foreground">{emailAddress}.</span>
          </p>
        </div>

        {/* Verification Form */}
        <form
          onSubmit={handleVerify}
          className="mt-6 flex flex-col items-center md:justify-center gap-5"
        >
          {/* OTP */}
          <div className="flex w-full justify-center items-center">
            <InputOTP
              maxLength={6}
              value={code}
              disabled={isLoading}
              onChange={(value) => setCode(value)}
              containerClassName="w-full justify-center"
            >
              <InputOTPGroup className="gap-1.5 sm:gap-3">
                <InputOTPSlot
                  index={0}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold first:rounded-md min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl sm:first:rounded-lg"
                />

                <InputOTPSlot
                  index={1}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl"
                />

                <InputOTPSlot
                  index={2}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl"
                />

                <InputOTPSlot
                  index={3}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl"
                />

                <InputOTPSlot
                  index={4}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl"
                />

                <InputOTPSlot
                  index={5}
                  className="size-10 rounded-md border border-input bg-background text-base font-semibold last:rounded-md min-[380px]:size-11 sm:size-14 sm:rounded-lg sm:text-xl sm:last:rounded-lg"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Clerk Error */}
          {errors.fields.code && (
            <p className="w-full text-center text-sm text-destructive">
              {errors.fields.code.message}
            </p>
          )}

          {/* General Error */}
          {formError && (
            <div
              role="alert"
              className="w-full rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive"
            >
              {formError}
            </div>
          )}

          {/* Resend Success */}
          {resendMessage && (
            <p className="w-full text-center text-sm text-success">
              {resendMessage}
            </p>
          )}

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="h-12 w-md text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify email"
            )}
          </Button>
        </form>

        {/* Actions */}
        <div className="mt-5 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleResendCode}
              className="font-medium text-primary transition-colors hover:text-primary/80 disabled:pointer-events-none disabled:opacity-50"
            >
              Resend code
            </button>
          </p>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleDifferentEmail}
            className="mt-3 text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:pointer-events-none disabled:opacity-50 sm:mt-4"
          >
            Use a different email
          </button>
        </div>

        <Separator className="my-5 sm:my-6" />

        <p className="text-center text-sm text-muted-foreground">
          Your workspace is almost ready.
        </p>
      </CardContent>
    </Card>
  );
}
