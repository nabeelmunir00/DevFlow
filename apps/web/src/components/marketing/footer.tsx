import Image from "next/image";
import Link from "next/link";
import { GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "DevFlow AI",
    href: "#devflow-ai",
  },
  {
    label: "GitHub",
    href: "#github",
  },
];

const resourceLinks = [
  {
    label: "Documentation",
    href: "#",
  },
  {
    label: "Changelog",
    href: "#",
  },
  {
    label: "Support",
    href: "#",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12">
        <div className="grid gap-12 py-12 md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="DevFlow home"
              className="inline-flex items-center gap-2"
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

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              An AI-powered engineering workspace for planning, building, and
              shipping better software together.
            </p>
          </div>

          {/* Product */}
          <FooterColumn title="Product" links={productLinks} />

          {/* Resources */}
          <FooterColumn title="Resources" links={resourceLinks} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <span className="text-muted-foreground">·</span>

            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>

            <Button variant="ghost" size="icon" className="ml-2 size-8">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GitBranch className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>

      <nav className="mt-4 flex flex-col items-start gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
