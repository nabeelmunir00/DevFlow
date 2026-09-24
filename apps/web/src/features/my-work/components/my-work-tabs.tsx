"use client";

import { Columns3, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { MyWorkLayout, MyWorkView } from "../types/my-work";

interface MyWorkTabsProps {
  value: MyWorkView;
  layout: MyWorkLayout;
  counts: {
    assigned: number;
    created: number;
    following: number;
  };
  onValueChange: (value: MyWorkView) => void;
  onLayoutChange: (layout: MyWorkLayout) => void;
}

const tabs: {
  value: MyWorkView;
  label: string;
}[] = [
  {
    value: "assigned",
    label: "Assigned to me",
  },
  {
    value: "created",
    label: "Created by me",
  },
  {
    value: "following",
    label: "Following",
  },
];

export function MyWorkTabs({
  value,
  layout,
  counts,
  onValueChange,
  onLayoutChange,
}: MyWorkTabsProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-b border-border sm:flex-row sm:items-end sm:justify-between">
      <div
        className="flex min-w-0 overflow-x-auto"
        role="tablist"
        aria-label="My work views"
      >
        {tabs.map((tab) => {
          const active = value === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onValueChange(tab.value)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-3 pb-3 pt-1 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}

              <span
                className={cn(
                  "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs",
                  active
                    ? "bg-secondary text-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {counts[tab.value]}
              </span>

              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mb-1 flex w-fit items-center rounded-md border border-border p-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange("list")}
          className={cn(
            "h-8 rounded-sm",
            layout === "list" &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
          )}
        >
          <List className="size-4" />
          List
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange("board")}
          className={cn(
            "h-8 rounded-sm",
            layout === "board" &&
              "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
          )}
        >
          <Columns3 className="size-4" />
          Board
        </Button>
      </div>
    </div>
  );
}
