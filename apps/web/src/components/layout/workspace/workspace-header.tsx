"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  SwitchCamera,
} from "lucide-react";

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
  onOpenSidebar: () => void;
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

export function WorkspaceHeader({ user, onOpenSidebar }: WorkspaceHeaderProps) {
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
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center border-b border-border bg-background">
      <div className="flex w-full min-w-0 items-center gap-3 px-4 xl:px-6">
        {/* ================================================
            SIDEBAR TRIGGER
        ================================================= */}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 xl:hidden"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <Menu className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </Button>

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
                        className="truncate text-muted-foreground transition-colors duration-150 hover:text-foreground"
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

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {/* ==============================================
              SEARCH
          =============================================== */}

          <div className="relative hidden w-64 md:block lg:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden="true"
            />

            <Input
              type="search"
              placeholder="Search anything..."
              aria-label="Search workspace"
              className="h-8 pr-12 pl-9"
            />

            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          {/* Mobile Search */}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Button>

          {/* ==============================================
              NOTIFICATIONS
          =============================================== */}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Button>

          {/* ==============================================
              USER MENU
          =============================================== */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open user menu"
                />
              }
            >
              <Avatar className="size-7">
                <AvatarImage src={user.imageUrl} alt={user.name} />

                <AvatarFallback className="text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-60"
            >
              {/* User Info */}

              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={user.imageUrl} alt={user.name} />

                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
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
                  <Settings className="size-4" strokeWidth={1.75} />

                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem render={<Link href="/select-workspace" />}>
                  <SwitchCamera className="size-4" strokeWidth={1.75} />

                  <span>Switch workspace</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Sign out */}

              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut className="size-4" strokeWidth={1.75} />

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
