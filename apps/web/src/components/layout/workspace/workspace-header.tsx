"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import { demoProjects } from "@/features/projects/components/data/demo-projects";

import type { WorkspaceUser } from "./workspace-shell";

interface WorkspaceHeaderProps {
  user: WorkspaceUser;
}

interface BreadcrumbData {
  label: string;
  href?: string;
}

function formatLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getBreadcrumbs(pathname: string): BreadcrumbData[] {
  const segments = pathname.split("/").filter(Boolean);

  const workspaceSegments = segments.slice(1);

  const breadcrumbs: BreadcrumbData[] = [
    {
      label: "Workspace",
      href: "/workspace",
    },
  ];

  if (workspaceSegments.length === 0) {
    breadcrumbs.push({
      label: "Home",
    });

    return breadcrumbs;
  }

  const section = workspaceSegments[0];

  if (section === "project") {
    breadcrumbs.push({
      label: "Projects",
      href: "/workspace/project",
    });

    const projectId = workspaceSegments[1];

    if (projectId) {
      const project = demoProjects.find((item) => item.id === projectId);

      breadcrumbs.push({
        label: project?.name ?? formatLabel(projectId),
      });
    }

    return breadcrumbs;
  }

  breadcrumbs.push({
    label: formatLabel(section),
  });

  return breadcrumbs;
}

export function WorkspaceHeader({ user }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const userInitials = getInitials(user.name || user.email) || "U";

  const breadcrumbs = getBreadcrumbs(pathname);

  async function handleSignOut() {
    await signOut({
      redirectUrl: "/",
    });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border bg-background">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* ================================================
            BREADCRUMB
        ================================================= */}

        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <Fragment key={`${breadcrumb.label}-${index}`}>
                  {index > 0 ? (
                    <BreadcrumbSeparator>
                      <span className="text-muted-foreground">/</span>
                    </BreadcrumbSeparator>
                  ) : null}

                  <BreadcrumbItem
                    className={
                      index === 0 ? "hidden sm:inline-flex" : undefined
                    }
                  >
                    {isLast || !breadcrumb.href ? (
                      <BreadcrumbPage className="truncate">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <Link
                        href={breadcrumb.href}
                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {breadcrumb.label}
                      </Link>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* ================================================
            RIGHT SIDE
        ================================================= */}

        <div className="ml-auto flex items-center gap-2">
          {/* ==============================================
              SEARCH
          =============================================== */}

          <div className="relative hidden w-64 md:block lg:w-72">
            <Icon
              icon="solar:magnifer-linear"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              type="search"
              placeholder="Search anything..."
              aria-label="Search workspace"
              className="h-9 rounded-md pl-9 pr-12"
            />

            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          {/* Mobile Search */}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-md md:hidden"
            aria-label="Search"
          >
            <Icon
              icon="solar:magnifer-linear"
              className="size-[18px]"
              aria-hidden="true"
            />
          </Button>

          {/* ==============================================
              NOTIFICATIONS
          =============================================== */}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Icon
              icon="solar:bell-linear"
              className="size-[18px]"
              aria-hidden="true"
            />
          </Button>

          {/* ==============================================
              USER MENU
          =============================================== */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md"
                  aria-label="Open user menu"
                />
              }
            >
              <Avatar className="size-8 rounded-md">
                <AvatarImage src={user.imageUrl} alt={user.name} />

                <AvatarFallback className="rounded-md text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-60 rounded-md"
            >
              {/* User Info */}

              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-md">
                      <AvatarImage src={user.imageUrl} alt={user.name} />

                      <AvatarFallback className="rounded-md">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Workspace actions */}

              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/workspace/settings" />}>
                  <Icon icon="solar:settings-linear" className="size-4" />

                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem render={<Link href="/select-workspace" />}>
                  <Icon
                    icon="solar:transfer-horizontal-linear"
                    className="size-4"
                  />

                  <span>Switch workspace</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Sign out */}

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleSignOut}>
                  <Icon icon="solar:logout-2-linear" className="size-4" />

                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
