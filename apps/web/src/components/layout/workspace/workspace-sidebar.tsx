"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Sidebar } from "@/components/ui/sidebar";

import {
  workspaceNavigation,
  workspaceSecondaryNavigation,
} from "@/config/workspace-navigation";

import type { WorkspaceUser } from "./workspace-shell";

import {
  getWorkspaceHref,
  isWorkspaceRouteActive,
  WorkspaceSidebarContent,
} from "./workspace-sidebar-content";

import { WorkspaceSidebarSheet } from "./workspace-sidebar-sheet";

interface WorkspaceSidebarProps {
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

function useDesktopSidebar() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleChange() {
      setIsDesktop(mediaQuery.matches);
    }

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isDesktop;
}

export function WorkspaceSidebar({ user }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const isDesktop = useDesktopSidebar();

  const [sheetOpen, setSheetOpen] = useState(false);

  const userInitials = getInitials(user.name || user.email) || "U";

  useEffect(() => {
    if (isDesktop) {
      setSheetOpen(false);
    }
  }, [isDesktop]);

  /*
   * Desktop
   * ---------------------------------------------
   * Normal shadcn sidebar.
   * User can expand/collapse it normally.
   */

  if (isDesktop) {
    return (
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="border-r border-sidebar-border"
      >
        <WorkspaceSidebarContent user={user} mode="desktop" />
      </Sidebar>
    );
  }

  /*
   * Tablet + Mobile
   * ---------------------------------------------
   * Permanent icon rail.
   * Full sidebar opens inside Sheet.
   */

  return (
    <>
      <aside className="flex w-14 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        {/* =============================================
            SHEET TRIGGER
        ============================================== */}

        <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Open sidebar"
            onClick={() => setSheetOpen(true)}
          >
            <Icon
              icon="solar:sidebar-minimalistic-linear"
              className="size-5"
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* =============================================
            WORKSPACE
        ============================================== */}

        <div className="flex justify-center border-b border-sidebar-border py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-md"
            aria-label="Open workspace navigation"
            onClick={() => setSheetOpen(true)}
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              W
            </span>
          </Button>
        </div>

        {/* =============================================
            MAIN NAVIGATION
        ============================================== */}

        <nav
          aria-label="Workspace navigation"
          className="md:flex hidden min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto py-3"
        >
          {workspaceNavigation.map((item) => {
            const href = getWorkspaceHref(item.href);

            const active = isWorkspaceRouteActive(pathname, item.href);

            return (
              <Button
                key={item.label}
                nativeButton={false}
                variant="ghost"
                size="icon"
                render={
                  <Link
                    href={href}
                    aria-label={item.label}
                    title={item.label}
                  />
                }
                className={
                  active
                    ? "size-9 rounded-md bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "size-9 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              >
                <Icon icon={item.icon} className="size-4" aria-hidden="true" />
              </Button>
            );
          })}
        </nav>

        {/* =============================================
            SECONDARY NAVIGATION
        ============================================== */}

        <div
          className="flex hidde
         shrink-0 flex-col items-center gap-1 border-t border-sidebar-border py-2"
        >
          {workspaceSecondaryNavigation.map((item) => {
            const href = getWorkspaceHref(item.href);

            const active = isWorkspaceRouteActive(pathname, item.href);

            return (
              <Button
                key={item.label}
                nativeButton={false}
                variant="ghost"
                size="icon"
                render={
                  <Link
                    href={href}
                    aria-label={item.label}
                    title={item.label}
                  />
                }
                className={
                  active
                    ? "size-9 rounded-md bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "size-9 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              >
                <Icon icon={item.icon} className="size-4" aria-hidden="true" />
              </Button>
            );
          })}
        </div>

        {/* =============================================
            CURRENT USER
        ============================================== */}

        <div className="flex shrink-0 justify-center border-t border-sidebar-border py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-md"
            aria-label="Open user navigation"
            onClick={() => setSheetOpen(true)}
          >
            <Avatar className="size-8 rounded-md">
              <AvatarImage src={user.imageUrl} alt={user.name} />

              <AvatarFallback className="rounded-md text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </aside>

      <WorkspaceSidebarSheet
        user={user}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
