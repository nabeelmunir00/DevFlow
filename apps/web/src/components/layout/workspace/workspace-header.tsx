"use client";

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

import type { WorkspaceUser } from "./workspace-shell";

interface WorkspaceHeaderProps {
  slug: string;
  user: WorkspaceUser;
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

export function WorkspaceHeader({ slug, user }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const workspacePath = `/workspace/${slug}`;
  const workspaceName = formatLabel(slug);

  const userInitials = getInitials(user.name || user.email) || "U";

  const currentPath = pathname
    .replace(workspacePath, "")
    .split("/")
    .filter(Boolean);

  const currentPage =
    currentPath.length > 0
      ? formatLabel(currentPath[currentPath.length - 1])
      : "Home";

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
            <BreadcrumbItem className="hidden sm:inline-flex">
              <span className="truncate text-muted-foreground">
                {workspaceName}
              </span>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden sm:block">
              <span className="text-muted-foreground">/</span>
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className="truncate">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
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
            <Icon icon="solar:magnifer-linear" className="size-[18px]" />
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
            <Icon icon="solar:bell-linear" className="size-[18px]" />
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
                <DropdownMenuItem
                  render={<Link href={`${workspacePath}/settings`} />}
                >
                  <Icon icon="solar:settings-linear" className="size-4" />

                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem render={<Link href="/workspace" />}>
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
