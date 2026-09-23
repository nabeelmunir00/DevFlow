"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MyWorkHeaderProps {
  onCreateTask?: () => void;
}

export function MyWorkHeader({ onCreateTask }: MyWorkHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Work
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Your tasks, pull requests and activity, all in one place.
        </p>
      </div>

      <Button type="button" onClick={onCreateTask} className="self-start">
        <Plus className="size-4" />
        Create
      </Button>
    </div>
  );
}
