"use client";

import { Check, ChevronDown, FolderInput, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MyWorkTaskStatus } from "../types/my-work";

interface BulkTaskActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkComplete?: () => void;
  onChangePriority?: (priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW") => void;
  onMoveTasks?: (status: MyWorkTaskStatus) => void;
  onDelete?: () => void;
}

export function BulkTaskActions({
  selectedCount,
  onMarkComplete,
  onChangePriority,
  onMoveTasks,
  onDelete,
}: BulkTaskActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-30 mt-4 flex justify-center px-3">
      <div className="flex w-full items-center justify-between gap-1 overflow-x-auto rounded-md border border-border bg-card px-2 py-2 shadow-lg">
        <div className="flex shrink-0 items-center px-2">
          <span className="whitespace-nowrap text-sm font-medium text-foreground">
            {selectedCount}{" "}
            {selectedCount === 1 ? "task selected" : "tasks selected"}
          </span>
        </div>

        <div className="mx-1 h-5 w-px shrink-0 bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onMarkComplete}
          className="h-8 shrink-0 gap-2 px-3 font-normal"
        >
          <Check className="size-4" />
          Mark complete
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 gap-2 px-3 font-normal"
              />
            }
          >
            Change priority
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
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

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 gap-2 px-3 font-normal"
              />
            }
          >
            <FolderInput className="size-4" />
            Move
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onMoveTasks?.("TODO")}>
                Move to Todo
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onMoveTasks?.("IN_PROGRESS")}>
                Move to In progress
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onMoveTasks?.("IN_REVIEW")}>
                Move to In review
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onMoveTasks?.("DONE")}>
                Move to Done
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 h-5 w-px shrink-0 bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 shrink-0 gap-2 px-3 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
