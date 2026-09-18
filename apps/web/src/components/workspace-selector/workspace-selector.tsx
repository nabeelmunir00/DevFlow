import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";

export function WorkspaceSelector() {
  return (
    <div className="min-h-dvh">
      {/* Navbar */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="DevFlow home"
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="size-9 object-contain"
            />

            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              DevFlow
            </span>
          </Link>

          <UserButton />
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Choose a workspace
          </h1>

          <p className="mt-3 text-base text-muted-foreground">
            Pick where you&apos;d like to work.
          </p>
        </div>

        <div className="mt-10">
          {/*
            NEXT STEP:
            Real organizations/workspaces will render here.
          */}
        </div>

        <Separator className="mt-12" />
      </div>
    </div>
  );
}
