import Image from "next/image";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label="DevFlow home"
          className="flex items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            priority
            className="size-12 object-contain"
          />

          <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
            DevFlow
          </span>
        </Link>

        <nav
          aria-label="Account navigation"
          className="flex items-center gap-2"
        >
          <Show when="signed-out">
            <SignInButton>
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="hidden md:flex" size="lg">
                Get started
              </Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
