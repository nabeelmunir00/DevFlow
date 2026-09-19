"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import {
  workspaceNavigation,
  workspaceSecondaryNavigation,
} from "@/config/workspace-navigation";

interface WorkspaceSidebarProps {
  slug: string;
}

export function WorkspaceSidebar({ slug }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const workspacePath = `/workspace/${slug}`;

  function getHref(href: string) {
    return href ? `${workspacePath}/${href}` : workspacePath;
  }

  function isActive(href: string) {
    const target = getHref(href);

    if (!href) {
      return pathname === workspacePath;
    }

    return pathname === target || pathname.startsWith(`${target}/`);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link
          href="/workspace"
          className="flex items-center gap-2.5"
          aria-label="DevFlow workspaces"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="size-8 object-contain"
          />

          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            DevFlow
          </span>
        </Link>
      </div>

      <div className="border-b border-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            {slug.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {slug}
            </p>

            <p className="text-xs text-muted-foreground">Workspace</p>
          </div>

          <Icon
            icon="solar:alt-arrow-down-linear"
            className="size-4 text-muted-foreground"
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {workspaceNavigation.map((item) => {
            const href = getHref(item.href);
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                    : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
              >
                <Icon icon={item.icon} className="size-5 shrink-0" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="space-y-1">
          {workspaceSecondaryNavigation.map((item) => {
            const href = getHref(item.href);
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                    : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
              >
                <Icon icon={item.icon} className="size-5 shrink-0" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
