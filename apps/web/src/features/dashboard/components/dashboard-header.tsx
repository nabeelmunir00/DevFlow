"use client";

import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { user } = useUser();

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Workspace overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Good morning, {firstName}. Here&apos;s what needs your attention.
        </p>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-2 rounded-md px-3 font-normal"
        >
          <Icon icon="solar:calendar-linear" className="size-4" />

          <span>Last 7 days</span>

          <Icon
            icon="solar:alt-arrow-down-linear"
            className="size-3.5 text-muted-foreground"
          />
        </Button>

        <Button type="button" className="h-12 gap-2 rounded-md px-6">
          <Icon icon="solar:add-linear" className="size-4" />

          <span>Create</span>
        </Button>
      </div>
    </section>
  );
}
