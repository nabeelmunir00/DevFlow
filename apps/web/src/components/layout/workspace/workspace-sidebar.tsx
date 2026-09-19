"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

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
} from "@/components/ui/sidebar";

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

  const workspaceInitials = slug
    .split("-")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const workspaceName = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-sidebar-border"
    >
      {/* DevFlow */}
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <div className="flex h-16 items-center px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Link
            href="/workspace"
            aria-label="DevFlow workspaces"
            className="flex min-w-0 items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              priority
              className="size-8 shrink-0 object-contain"
            />

            <span className="truncate font-heading text-lg font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              DevFlow
            </span>
          </Link>
        </div>

        {/* Workspace switcher */}
        <div className="px-2 pb-2 group-data-[collapsible=icon]:px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip={workspaceName}
                className="h-auto min-h-14 gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-2 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
                  {workspaceInitials || "W"}
                </div>

                <div className="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                    {workspaceName}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    Workspace
                  </span>
                </div>

                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>

      {/* Navigation */}
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
                      className="h-9 gap-3 px-3 text-muted-foreground hover:text-sidebar-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
                    >
                      <Icon icon={item.icon} className="size-5 shrink-0" />

                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom navigation */}
      <SidebarFooter className="p-0">
        <SidebarSeparator className="mx-0 w-full" />

        <SidebarGroup className="px-2 py-2">
          <SidebarGroupContent>
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
                      className="h-9 gap-3 px-3 text-muted-foreground hover:text-sidebar-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
                    >
                      <Icon icon={item.icon} className="size-5 shrink-0" />

                      <span>{item.label}</span>

                      {item.href === "notifications" && (
                        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground group-data-[collapsible=icon]:hidden">
                          3
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Temporary user section */}
        <div className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip="Account"
                className="h-auto min-h-12 gap-3 px-2"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                  U
                </div>

                <div className="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-sm font-medium text-sidebar-foreground">
                    Account
                  </span>

                  <span className="block truncate text-xs text-muted-foreground">
                    Signed in
                  </span>
                </div>

                <Icon
                  icon="solar:menu-dots-bold"
                  className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
