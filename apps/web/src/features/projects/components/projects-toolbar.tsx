"use client";

import { ChevronDown, Grid2X2, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export type ProjectView = "list" | "grid";

interface ProjectsToolbarProps {
  view: ProjectView;
  onViewChange: (view: ProjectView) => void;
}

export function ProjectsToolbar({ view, onViewChange }: ProjectsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-80 lg:w-96">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            type="search"
            placeholder="Search projects..."
            aria-label="Search projects"
            className="h-10 w-full rounded-md pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-3 rounded-md px-4 font-normal"
              />
            }
          >
            Status
            <ChevronDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>All statuses</DropdownMenuItem>
            <DropdownMenuItem>In progress</DropdownMenuItem>
            <DropdownMenuItem>In review</DropdownMenuItem>
            <DropdownMenuItem>On track</DropdownMenuItem>
            <DropdownMenuItem>Blocked</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-3 rounded-md px-4 font-normal"
              />
            }
          >
            Team
            <ChevronDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>All members</DropdownMenuItem>
            <DropdownMenuItem>My projects</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-3 rounded-md px-4 font-normal"
              />
            }
          >
            Sort
            <ChevronDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>Recently updated</DropdownMenuItem>
            <DropdownMenuItem>Name</DropdownMenuItem>
            <DropdownMenuItem>Progress</DropdownMenuItem>
            <DropdownMenuItem>Due date</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex shrink-0 self-start rounded-md border border-border p-1 lg:self-auto">
        <Button
          type="button"
          variant={view === "list" ? "default" : "ghost"}
          size="icon"
          className="size-8 rounded-sm"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
        >
          <List className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant={view === "grid" ? "default" : "ghost"}
          size="icon"
          className="size-8 rounded-sm"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => onViewChange("grid")}
        >
          <Grid2X2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
