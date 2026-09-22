"use client";

import { AppTabs, type AppTab } from "@/components/shared/app-tabs";

export type SprintView = "active" | "upcoming" | "completed";

interface SprintViewTabsProps {
  value: SprintView;
  onValueChange: (value: SprintView) => void;
}

const sprintTabs = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "completed",
    label: "Completed",
  },
] satisfies readonly AppTab<SprintView>[];

export function SprintViewTabs({ value, onValueChange }: SprintViewTabsProps) {
  return (
    <AppTabs
      tabs={sprintTabs}
      value={value}
      onValueChange={onValueChange}
      ariaLabel="Sprint views"
    />
  );
}
