"use client";

import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { user } = useUser();

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  return (
    <section className="flex min-h-14 items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-foreground">
          Workspace overview
        </h1>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Good morning, {firstName}. Here&apos;s what needs your attention.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-md px-3 font-normal"
        >
          <Icon icon="solar:calendar-linear" className="size-4" />
          Last 7 days
          <Icon
            icon="solar:alt-arrow-down-linear"
            className="size-3.5 text-muted-foreground"
          />
        </Button>

        <Button type="button" size="sm" className="h-9 gap-1.5 rounded-md px-4">
          <Icon icon="solar:add-linear" className="size-4" />
          Create
        </Button>
      </div>
    </section>
  );
}
