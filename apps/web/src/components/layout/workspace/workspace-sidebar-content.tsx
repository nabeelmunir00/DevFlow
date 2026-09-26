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
  SidebarTrigger,
  useSidebar,
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
    className: "size-4 shrink-0",
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
          className="size-4 shrink-0"
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
  collapsed: boolean;
  onNavigate?: () => void;
}

function NavigationMenu({
  items,
  pathname,
  collapsed,
  onNavigate,
}: NavigationMenuProps) {
  return (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => {
        const href = getWorkspaceHref(item.href);
        const active = isWorkspaceRouteActive(pathname, item.href);

        return (
          <SidebarMenuItem key={item.label} className="relative">
            {/* Active indicator */}
            {active ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 z-10 w-0.5 -translate-y-1/2 rounded-r-full bg-primary",
                  collapsed ? "-left-0  h-7" : "-left-0 h-8",
                )}
              />
            ) : null}

            <SidebarMenuButton
              tooltip={item.label}
              isActive={active}
              render={
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-label={collapsed ? item.label : undefined}
                />
              }
              className={cn(
                "relative h-9 rounded-md text-sm font-normal",
                "text-sidebar-foreground/75",
                "transition-colors duration-150 ease-out",
                "hover:bg-hover hover:text-sidebar-foreground",
                "data-[active=true]:bg-accent",
                "data-[active=true]:font-medium",
                "data-[active=true]:text-primary",

                collapsed ? "justify-center gap-0 px-0" : "gap-3 px-2.5",
              )}
            >
              <NavigationIcon icon={item.icon} />

              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>

                  {item.badge ? (
                    <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              ) : item.badge ? (
                <span
                  aria-label={`${item.badge} notifications`}
                  className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary"
                />
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

  const { state } = useSidebar();

  const isSheet = mode === "sheet";

  // Sheet always shows the full sidebar.
  const collapsed = !isSheet && state === "collapsed";

  const userInitials = getInitials(user.name || user.email) || "U";

  const workspaceName = "DevFlow Studio";

  const dropdownSide = isSheet ? "bottom" : "right";

  return (
    <div className="flex h-full  min-h-0 w-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      {/* ================================================
          BRAND
      ================================================= */}

      <SidebarHeader
        className={cn(
          "shrink-0 gap-0 border-b border-sidebar-border py-0",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed ? (
            <>
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
                <SidebarTrigger className="ml-2 size-8 shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground" />
              ) : null}
            </>
          ) : (
            <SidebarTrigger
              aria-label="Expand sidebar"
              className="size-8 shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground"
            />
          )}
        </div>

        {/* ==============================================
            WORKSPACE SWITCHER
        =============================================== */}

        {!collapsed ? (
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
                    className="size-4 shrink-0 text-muted-foreground"
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
                  render={
                    <Link href="/select-workspace" onClick={onNavigate} />
                  }
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
        ) : (
          <DropdownMenu>
            <SidebarMenu className="pb-3">
              <SidebarMenuItem>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={workspaceName}
                      aria-label={workspaceName}
                      className="h-9 justify-center gap-0 rounded-md px-0 data-[state=open]:bg-hover"
                    />
                  }
                >
                  <BriefcaseBusiness
                    className="size-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
              </SidebarMenuItem>
            </SidebarMenu>

            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={8}
              className="min-w-56"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>{workspaceName}</DropdownMenuLabel>

                <DropdownMenuItem
                  render={
                    <Link href="/select-workspace" onClick={onNavigate} />
                  }
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
        )}
      </SidebarHeader>

      {/* ================================================
          MAIN NAVIGATION
      ================================================= */}

      <SidebarContent className="min-h-0">
        <SidebarGroup className={cn("py-3", collapsed ? "px-2" : "px-3")}>
          <SidebarGroupContent>
            <NavigationMenu
              items={mainNavigation}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================================================
          FOOTER NAVIGATION
      ================================================= */}

      <SidebarFooter
        className={cn("shrink-0 gap-0 pb-3", collapsed ? "px-2" : "px-3")}
      >
        <SidebarSeparator className={cn("mb-3", collapsed ? "mx-0" : "mx-0")} />

        <NavigationMenu
          items={secondaryNavigation}
          pathname={pathname}
          collapsed={collapsed}
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
                    aria-label={
                      collapsed ? `Open ${user.name} menu` : undefined
                    }
                    className={cn(
                      "rounded-md data-[state=open]:bg-hover data-[state=open]:text-sidebar-foreground",
                      collapsed
                        ? "h-10 justify-center gap-0 px-0"
                        : "h-12 px-2",
                    )}
                  />
                }
              >
                <Avatar
                  className={cn("shrink-0", collapsed ? "size-7" : "size-9")}
                >
                  <AvatarImage src={user.imageUrl} alt={user.name} />

                  <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                {!collapsed ? (
                  <>
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
                  </>
                ) : null}
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align={collapsed ? "start" : "end"}
            side={dropdownSide}
            sideOffset={8}
            className="min-w-60"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={user.imageUrl} alt={user.name} />

                    <AvatarFallback className="bg-muted text-foreground">
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
