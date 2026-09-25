"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import {
  Activity,
  Bell,
  Bot,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  ChevronDown,
  ChevronLeft,
  Folder,
  House,
  Settings,
  SquareCheck,
  TimerReset,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { assets } from "@/assets/assets";
import { cn } from "@/lib/utils";

import type { WorkspaceUser } from "./workspace-shell";

interface WorkspaceSidebarContentProps {
  user: WorkspaceUser;
  mode?: "desktop" | "sheet";
  onNavigate?: () => void;
}

type NavigationIcon =
  | "home"
  | "my-work"
  | "projects"
  | "tasks"
  | "sprints"
  | "teams"
  | "github"
  | "ai"
  | "analytics"
  | "activity"
  | "notifications"
  | "settings";

interface NavigationItem {
  label: string;
  href: string;
  icon: NavigationIcon;
  badge?: number;
}

const mainNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "",
    icon: "home",
  },
  {
    label: "My Work",
    href: "my-work",
    icon: "my-work",
  },
  {
    label: "Projects",
    href: "project",
    icon: "projects",
  },
  {
    label: "Tasks",
    href: "tasks",
    icon: "tasks",
  },
  {
    label: "Sprints",
    href: "sprints",
    icon: "sprints",
  },
  {
    label: "Teams",
    href: "teams",
    icon: "teams",
  },
  {
    label: "GitHub",
    href: "github",
    icon: "github",
  },
  {
    label: "AI Assistant",
    href: "ai",
    icon: "ai",
  },
  {
    label: "Analytics",
    href: "analytics",
    icon: "analytics",
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    label: "Activity",
    href: "activity",
    icon: "activity",
  },
  {
    label: "Notifications",
    href: "notifications",
    icon: "notifications",
    badge: 3,
  },
  {
    label: "Settings",
    href: "settings",
    icon: "settings",
  },
];

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getWorkspaceHref(href: string) {
  if (!href) {
    return "/workspace";
  }

  return `/workspace/${href}`;
}

export function isWorkspaceRouteActive(pathname: string, href: string) {
  const target = getWorkspaceHref(href);

  if (!href) {
    return pathname === "/workspace";
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}

function NavigationIcon({ icon }: { icon: NavigationIcon }) {
  const iconProps = {
    className: "size-4.5 shrink-0",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "home":
      return <House {...iconProps} />;

    case "my-work":
      return <UserRound {...iconProps} />;

    case "projects":
      return <Folder {...iconProps} />;

    case "tasks":
      return <SquareCheck {...iconProps} />;

    case "sprints":
      return <TimerReset {...iconProps} />;

    case "teams":
      return <UsersRound {...iconProps} />;

    case "github":
      return (
        <Icon
          icon="mdi:github"
          className="size-4.5 shrink-0"
          aria-hidden="true"
        />
      );

    case "ai":
      return <Bot {...iconProps} />;

    case "analytics":
      return <ChartNoAxesColumn {...iconProps} />;

    case "activity":
      return <Activity {...iconProps} />;

    case "notifications":
      return <Bell {...iconProps} />;

    case "settings":
      return <Settings {...iconProps} />;

    default:
      return null;
  }
}

interface NavigationMenuProps {
  items: NavigationItem[];
  pathname: string;
  onNavigate?: () => void;
}

function NavigationMenu({ items, pathname, onNavigate }: NavigationMenuProps) {
  return (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => {
        const href = getWorkspaceHref(item.href);

        const active = isWorkspaceRouteActive(pathname, item.href);

        return (
          <SidebarMenuItem key={item.label} className="relative">
            <SidebarMenuButton
              tooltip={item.label}
              isActive={active}
              render={<Link href={href} onClick={onNavigate} />}
              className={cn(
                [
                  "group/nav-item relative",
                  "h-9 gap-3",
                  "rounded-md px-2.5",
                  "text-sm font-normal",
                  "text-sidebar-foreground/75",

                  "transition-colors",
                  "duration-150 ease-out",

                  "hover:bg-hover",
                  "hover:text-sidebar-foreground",

                  // Active state
                  "data-[active=true]:bg-accent",
                  "data-[active=true]:font-medium",
                  "data-[active=true]:text-primary",

                  // Active left indicator
                  "before:pointer-events-none",
                  "before:absolute",
                  "before:top-1/2",
                  "before:-left-3",
                  "before:h-8",
                  "before:w-0.5",
                  "before:-translate-y-1/2",
                  "before:rounded-r-full",
                  "before:bg-primary",
                  "before:opacity-0",
                  "before:transition-opacity",
                  "before:duration-150",

                  "data-[active=true]:before:opacity-100",
                ].join(" "),
              )}
            >
              <NavigationIcon icon={item.icon} />

              <span className="min-w-0 flex-1 truncate">{item.label}</span>

              {item.badge ? (
                <span
                  className={cn(
                    [
                      "ml-auto flex size-5 shrink-0",
                      "items-center justify-center",
                      "rounded-full",
                      "bg-primary",
                      "text-[11px] font-semibold",
                      "text-primary-foreground",
                    ].join(" "),
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function WorkspaceSidebarContent({
  user,
  mode = "desktop",
  onNavigate,
}: WorkspaceSidebarContentProps) {
  const pathname = usePathname();

  const isSheet = mode === "sheet";

  const userInitials = getInitials(user.name || user.email) || "U";

  const workspaceName = "DevFlow Studio";

  const dropdownSide = isSheet ? "bottom" : "right";

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* ================================================
          BRAND
      ================================================= */}

      <SidebarHeader className="shrink-0 gap-0 border-b border-sidebar-border px-3 py-0">
        <div className="flex h-16 items-center">
          <Link
            href="/workspace"
            onClick={onNavigate}
            aria-label="DevFlow home"
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <Image
              src={assets.newLogo}
              alt="DevFlow"
              width={32}
              height={32}
              priority
              className="size-8 shrink-0 object-contain"
            />

            <div className="flex min-w-0 items-start">
              <span className="truncate font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
                DevFlow
              </span>

              <span className="mt-0.5 ml-1 text-[10px] font-medium text-muted-foreground">
                AI
              </span>
            </div>
          </Link>

          {!isSheet ? (
            <button
              type="button"
              aria-label="Collapse sidebar"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-hover hover:text-foreground"
            >
              <ChevronLeft
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>

        {/* ==============================================
            WORKSPACE SWITCHER
        =============================================== */}

        <DropdownMenu>
          <SidebarMenu className="pb-3">
            <SidebarMenuItem>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={workspaceName}
                    className={[
                      "h-10 rounded-md px-2",
                      "data-[state=open]:bg-hover",
                      "data-[state=open]:text-sidebar-foreground",
                    ].join(" ")}
                  />
                }
              >
                <BriefcaseBusiness
                  className="size-4.5 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />

                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {workspaceName}
                </span>

                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align="start"
            side={dropdownSide}
            sideOffset={8}
            className="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspace</DropdownMenuLabel>

              <DropdownMenuItem
                render={<Link href="/select-workspace" onClick={onNavigate} />}
              >
                <BriefcaseBusiness className="size-4" strokeWidth={1.75} />

                <span>Switch workspace</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={
                  <Link href="/workspace/settings" onClick={onNavigate} />
                }
              >
                <Settings className="size-4" strokeWidth={1.75} />

                <span>Workspace settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      {/* ================================================
          MAIN NAVIGATION
      ================================================= */}

      <SidebarContent className="min-h-0">
        <SidebarGroup className="px-3 py-3">
          <SidebarGroupContent>
            <NavigationMenu
              items={mainNavigation}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================================================
          FOOTER NAVIGATION
      ================================================= */}

      <SidebarFooter className="shrink-0 gap-0 px-3 pb-3">
        <SidebarSeparator className="mx-0 mb-3" />

        <NavigationMenu
          items={secondaryNavigation}
          pathname={pathname}
          onNavigate={onNavigate}
        />

        <SidebarSeparator className="mx-0 my-3" />

        {/* ==============================================
            CURRENT USER
        =============================================== */}

        <DropdownMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user.name}
                    className={[
                      "h-12 rounded-md px-2",
                      "data-[state=open]:bg-hover",
                      "data-[state=open]:text-sidebar-foreground",
                    ].join(" ")}
                  />
                }
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarImage src={user.imageUrl} alt={user.name} />

                  <AvatarFallback className="text-xs font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {user.name}
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align="end"
            side={dropdownSide}
            sideOffset={8}
            className="min-w-60"
          >
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

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link href="/workspace/settings" onClick={onNavigate} />
                }
              >
                <Settings className="size-4" strokeWidth={1.75} />

                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href="/select-workspace" onClick={onNavigate} />}
              >
                <BriefcaseBusiness className="size-4" strokeWidth={1.75} />

                <span>Switch workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </div>
  );
}
