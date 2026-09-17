import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section
      id="product"
      className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-14 lg:pt-24"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        {/* Left */}
        <div>
          <h1 className="max-w-xl text-2xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-6xl">
            Your team&apos;s work,
            <br className="hidden sm:block" /> connected.
          </h1>

          <p className="mt-7 text-sm leading-8 text-muted-foreground">
            Projects, tasks, and conversations in one focused workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-14 px-7 f text-base font-semibold">
              <Link href="/sign-up" className="flex items-center gap-2">
                Create your workspace
                <ArrowRight className="size-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 border-input bg-transparent px-7 text-base font-medium shadow-none"
            >
              <Link href="#features">Explore the product</Link>
            </Button>
          </div>
        </div>

        {/* Right */}
        <ProductPreview />
      </div>
    </section>
  );
}
