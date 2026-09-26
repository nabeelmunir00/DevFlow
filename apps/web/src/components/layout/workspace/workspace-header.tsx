"use client";

import { Fragment } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import {
  Bell,
  Check,
  ChevronDown,
  FolderPlus,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Plus,
  Search,
  Settings,
  SquareCheck,
  Sun,
  SwitchCamera,
  TimerReset,
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

type ThemeOption = "light" | "dark" | "system";

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

  const { theme, setTheme } = useTheme();

  const userInitials = getInitials(user.name || user.email) || "U";

  const breadcrumbs = getBreadcrumbs(pathname);

  const selectedTheme: ThemeOption =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  async function handleSignOut() {
    await signOut({
      redirectUrl: "/",
    });
  }

  /*
   * These handlers will open the reusable create
   * dialogs when we connect them.
   */
  function handleCreateTask() {
    console.log("Open create task dialog");
  }

  function handleCreateProject() {
    console.log("Open create project dialog");
  }

  function handleCreateSprint() {
    console.log("Open create sprint dialog");
  }

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center border-b border-border bg-background">
      <div className="flex h-full w-full min-w-0 items-center gap-3 px-4 xl:px-6">
        {/* ==================================================
            MOBILE / TABLET SIDEBAR TRIGGER
        =================================================== */}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-ml-1 shrink-0 xl:hidden"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <Menu className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </Button>

        {/* ==================================================
            BREADCRUMBS
        =================================================== */}

        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="flex-nowrap gap-1.5 overflow-hidden">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <Fragment key={`${breadcrumb.label}-${index}`}>
                  {index > 0 ? (
                    <BreadcrumbSeparator className="shrink-0">
                      <span className="text-muted-foreground/70">/</span>
                    </BreadcrumbSeparator>
                  ) : null}

                  <BreadcrumbItem
                    className={
                      index === 0 ? "hidden shrink-0 sm:inline-flex" : "min-w-0"
                    }
                  >
                    {isLast || !breadcrumb.href ? (
                      <BreadcrumbPage className="truncate text-sm font-medium text-foreground">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <Link
                        href={breadcrumb.href}
                        className="truncate text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
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

        {/* ==================================================
            HEADER ACTIONS
        =================================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {/* ================================================
              SEARCH - DESKTOP / TABLET
          ================================================= */}

          <div className="relative hidden w-56 md:block lg:w-64 xl:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden="true"
            />

            <Input
              type="search"
              placeholder="Search anything..."
              aria-label="Search workspace"
              className="h-8 bg-background pr-12 pl-9 text-sm shadow-none"
            />

            <kbd className="pointer-events-none absolute top-1/2 right-2 flex h-5 -translate-y-1/2 items-center rounded-sm border border-border bg-muted px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground">
              ⌘ K
            </kbd>
          </div>

          {/* ================================================
              SEARCH - MOBILE
          ================================================= */}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Search"
          >
            <Search className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Button>

          {/* ================================================
              CREATE
          ================================================= */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  size="sm"
                  className="h-8 shrink-0 gap-1.5 px-2.5"
                  aria-label="Create"
                />
              }
            >
              <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />

              <span className="hidden sm:inline">Create</span>

              <ChevronDown
                className="hidden size-3.5 sm:block"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-56"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Create</DropdownMenuLabel>

                <DropdownMenuItem onClick={handleCreateTask}>
                  <SquareCheck className="size-4" strokeWidth={1.75} />

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <span>Create task</span>

                    <kbd className="font-mono text-[10px] text-muted-foreground">
                      ⌘⇧T
                    </kbd>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCreateProject}>
                  <FolderPlus className="size-4" strokeWidth={1.75} />

                  <span>Create project</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCreateSprint}>
                  <TimerReset className="size-4" strokeWidth={1.75} />

                  <span>Create sprint</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ================================================
              NOTIFICATIONS
          ================================================= */}

          <Button
            nativeButton={false}
            variant="ghost"
            size="icon-sm"
            className="relative shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground"
            aria-label="Notifications"
            render={<Link href="/workspace/notifications" />}
          >
            <Bell className="size-4" strokeWidth={1.75} aria-hidden="true" />

            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary"
            />
          </Button>

          {/* ================================================
              APPEARANCE / THEME
          ================================================= */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground data-[state=open]:bg-hover data-[state=open]:text-foreground"
                  aria-label="Appearance"
                />
              }
            >
              <Sun className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-48"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>

                {/* Light */}

                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className={
                    selectedTheme === "light"
                      ? "bg-accent text-accent-foreground"
                      : undefined
                  }
                >
                  <Sun className="size-4" strokeWidth={1.75} />

                  <span className="flex-1">Light</span>

                  {selectedTheme === "light" ? (
                    <Check className="size-4 text-primary" strokeWidth={1.75} />
                  ) : null}
                </DropdownMenuItem>

                {/* Dark */}

                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className={
                    selectedTheme === "dark"
                      ? "bg-accent text-accent-foreground"
                      : undefined
                  }
                >
                  <Moon className="size-4" strokeWidth={1.75} />

                  <span className="flex-1">Dark</span>

                  {selectedTheme === "dark" ? (
                    <Check className="size-4 text-primary" strokeWidth={1.75} />
                  ) : null}
                </DropdownMenuItem>

                {/* System */}

                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className={
                    selectedTheme === "system"
                      ? "bg-accent text-accent-foreground"
                      : undefined
                  }
                >
                  <Monitor className="size-4" strokeWidth={1.75} />

                  <span className="flex-1">System</span>

                  {selectedTheme === "system" ? (
                    <Check className="size-4 text-primary" strokeWidth={1.75} />
                  ) : null}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ================================================
              USER
          ================================================= */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open user menu"
                  className="shrink-0 rounded-full p-0 hover:bg-hover"
                />
              }
            >
              <Avatar className="size-7">
                <AvatarImage src={user.imageUrl} alt={user.name} />

                <AvatarFallback className="bg-muted text-[11px] font-medium text-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-60"
            >
              {/* ============================================
                  USER INFO
              ============================================= */}

              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage src={user.imageUrl} alt={user.name} />

                      <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                        {userInitials}
                      </AvatarFallback>
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

              {/* ============================================
                  USER ACTIONS
              ============================================= */}

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

              {/* ============================================
                  SIGN OUT
              ============================================= */}

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
