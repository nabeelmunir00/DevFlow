"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

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
  Sidebar,
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

import {
  workspaceNavigation,
  workspaceSecondaryNavigation,
} from "@/config/workspace-navigation";

import type { WorkspaceUser } from "./workspace-shell";

interface WorkspaceSidebarProps {
  slug: string;
  user: WorkspaceUser;
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

function formatWorkspaceName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function WorkspaceSidebar({ slug, user }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const { isMobile, state } = useSidebar();

  const isCollapsed = state === "collapsed";

  const workspacePath = `/workspace/${slug}`;
  const workspaceName = formatWorkspaceName(slug);

  const workspaceInitials = getInitials(workspaceName) || "W";

  const userInitials = getInitials(user.name || user.email) || "U";

  function getHref(href: string) {
    if (!href) {
      return workspacePath;
    }

    return `${workspacePath}/${href}`;
  }

  function isActive(href: string) {
    const target = getHref(href);

    if (!href) {
      return pathname === workspacePath;
    }

    return pathname === target || pathname.startsWith(`${target}/`);
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-sidebar-border"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <SidebarHeader className="gap-2 border-b border-sidebar-border p-2">
        {/* =================================================
            BRAND + SIDEBAR TOGGLE
        ================================================== */}

        <div className="flex h-10 items-center">
          {isCollapsed ? (
            /* Collapsed state: show expand button */
            <div className="flex w-full items-center justify-center">
              <SidebarTrigger
                className="size-8 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Expand sidebar"
              />
            </div>
          ) : (
            /* Expanded state: logo + title + collapse button */
            <>
              <Link
                href="/workspace"
                aria-label="DevFlow workspaces"
                className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden px-1"
              >
                <Image
                  src="/logo.png"
                  alt="DevFlow"
                  width={30}
                  height={30}
                  priority
                  className="size-[30px] shrink-0 object-contain"
                />

                <span className="truncate font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
                  DevFlow
                </span>
              </Link>

              <SidebarTrigger
                className="size-8 shrink-0 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Collapse sidebar"
              />
            </>
          )}
        </div>

        {/* =================================================
            WORKSPACE SWITCHER
        ================================================== */}

        <DropdownMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={workspaceName}
                    className="rounded-md data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                  {workspaceInitials}
                </div>

                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium">
                    {workspaceName}
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    Workspace
                  </span>
                </div>

                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className="ml-auto size-4 shrink-0 text-muted-foreground"
                />
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
            className="min-w-56 rounded-md"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Workspace
              </DropdownMenuLabel>

              <DropdownMenuItem render={<Link href="/workspace" />}>
                <Icon
                  icon="solar:transfer-horizontal-linear"
                  className="size-4"
                />

                <span>Switch workspace</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href={`${workspacePath}/settings`} />}
              >
                <Icon icon="solar:settings-linear" className="size-4" />

                <span>Workspace settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      {/* =====================================================
          MAIN NAVIGATION
      ====================================================== */}

      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {workspaceNavigation.map((item) => {
                const href = getHref(item.href);
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={active}
                      render={<Link href={href} />}
                      className="
                        h-9
                        gap-3
                        rounded-md
                        px-2.5
                        text-muted-foreground
                        transition-colors
                        hover:bg-sidebar-accent
                        hover:text-sidebar-accent-foreground
                        data-[active=true]:bg-primary/10
                        data-[active=true]:font-medium
                        data-[active=true]:text-primary
                      "
                    >
                      <Icon icon={item.icon} className="size-[18px] shrink-0" />

                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <SidebarFooter className="gap-2 p-2">
        {/* Secondary Navigation */}

        <SidebarMenu className="gap-1">
          {workspaceSecondaryNavigation.map((item) => {
            const href = getHref(item.href);
            const active = isActive(item.href);

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={active}
                  render={<Link href={href} />}
                  className="
                    h-9
                    gap-3
                    rounded-md
                    px-2.5
                    text-muted-foreground
                    transition-colors
                    hover:bg-sidebar-accent
                    hover:text-sidebar-accent-foreground
                    data-[active=true]:bg-primary/10
                    data-[active=true]:font-medium
                    data-[active=true]:text-primary
                  "
                >
                  <Icon icon={item.icon} className="size-[18px] shrink-0" />

                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <SidebarSeparator className="mx-0" />

        {/* =================================================
            CURRENT USER
        ================================================== */}

        <DropdownMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user.name}
                    className="
                      rounded-md
                      data-[state=open]:bg-sidebar-accent
                      data-[state=open]:text-sidebar-accent-foreground
                    "
                  />
                }
              >
                <Avatar className="size-8 shrink-0 rounded-md">
                  <AvatarImage src={user.imageUrl} alt={user.name} />

                  <AvatarFallback className="rounded-md">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium">
                    {user.name}
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <Icon
                  icon="solar:menu-dots-bold"
                  className="ml-auto size-4 shrink-0 text-muted-foreground"
                />
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align="end"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
            className="min-w-60 rounded-md"
          >
            {/* User information */}

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
                    <p className="truncate text-sm font-medium">{user.name}</p>

                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Account actions */}

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
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
