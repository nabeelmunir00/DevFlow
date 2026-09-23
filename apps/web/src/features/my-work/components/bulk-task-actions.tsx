"use client";

import { CheckCircle2, Flag, FolderInput, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkTaskActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkComplete?: () => void;
  onChangePriority?: (priority: string) => void;
  onMoveTasks?: () => void;
}

export function BulkTaskActions({
  selectedCount,
  onClearSelection,
  onMarkComplete,
  onChangePriority,
  onMoveTasks,
}: BulkTaskActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-20 mt-4 flex justify-center px-4">
      <div className="flex max-w-full items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
        <div className="flex items-center gap-2 px-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {selectedCount}
          </span>

          <span className="hidden text-xs font-medium text-foreground sm:inline">
            selected
          </span>
        </div>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onMarkComplete}
        >
          <CheckCircle2 className="size-4" />
          <span className="hidden sm:inline">Complete</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" variant="ghost" size="sm" />}
          >
            <Flag className="size-4" />
            <span className="hidden sm:inline">Priority</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onChangePriority?.("URGENT")}>
                Urgent
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onChangePriority?.("HIGH")}>
                High
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onChangePriority?.("MEDIUM")}>
                Medium
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onChangePriority?.("LOW")}>
                Low
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="ghost" size="sm" onClick={onMoveTasks}>
          <FolderInput className="size-4" />
          <span className="hidden sm:inline">Move</span>
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onClearSelection}
          aria-label="Clear selection"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
