"use client";

import {
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TasksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function TasksToolbar({ search, onSearchChange }: TasksToolbarProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search project tasks..."
          className="h-10 pl-9"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 font-normal"
      >
        <Filter className="size-4" />
        Filter
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 font-normal"
      >
        <ArrowUpDown className="size-4" />
        Sort
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 font-normal"
      >
        Group by Status
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 font-normal"
      >
        <Columns3 className="size-4" />
        Columns
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button type="button" className="h-10 gap-2">
        <Plus className="size-4" />
        Add task
      </Button>
    </div>
  );
}
