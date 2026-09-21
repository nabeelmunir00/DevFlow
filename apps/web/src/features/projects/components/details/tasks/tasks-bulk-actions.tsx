"use client";

import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TasksBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
}

export function TasksBulkActions({
  selectedCount,
  onClear,
}: TasksBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3">
      <span className="mr-2 text-sm font-medium text-foreground">
        {selectedCount} selected
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 bg-background font-normal"
      >
        Change status
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 bg-background font-normal"
      >
        Assign
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 bg-background font-normal"
      >
        Move to sprint
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto gap-2 text-muted-foreground"
        onClick={onClear}
      >
        <X className="size-4" />
        Clear
      </Button>
    </div>
  );
}
