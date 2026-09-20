"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function ProjectsToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Icon
            icon="solar:magnifer-linear"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input placeholder="Search projects..." className="h-10 pl-9" />
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
            <Icon
              icon="solar:alt-arrow-down-linear"
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
            <Icon
              icon="solar:alt-arrow-down-linear"
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
            <Icon
              icon="solar:alt-arrow-down-linear"
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

      <div className="flex shrink-0 rounded-md border border-border p-1">
        <Button
          type="button"
          size="icon"
          className="size-8 rounded-sm"
          aria-label="List view"
        >
          <Icon icon="solar:list-linear" className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-sm text-muted-foreground"
          aria-label="Grid view"
        >
          <Icon icon="solar:widget-4-linear" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
