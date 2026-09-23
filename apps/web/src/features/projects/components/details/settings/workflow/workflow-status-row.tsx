"use client";

import { Circle, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type WorkflowStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface WorkflowStatusItem {
  id: WorkflowStatus;
  name: string;
  description: string;
  isDefault?: boolean;
}

interface WorkflowStatusRowProps {
  status: WorkflowStatusItem;
  onSetDefault: (status: WorkflowStatus) => void;
}

function StatusIndicator({ status }: { status: WorkflowStatus }) {
  if (status === "DONE") {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-success/10">
        <Circle className="size-3 fill-success text-success" />
      </div>
    );
  }

  if (status === "IN_REVIEW") {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-warning/10">
        <Circle className="size-3 fill-warning text-warning" />
      </div>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
        <Circle className="size-3 fill-primary text-primary" />
      </div>
    );
  }

  return (
    <div className="flex size-5 items-center justify-center rounded-full bg-secondary">
      <Circle className="size-3 fill-muted-foreground text-muted-foreground" />
    </div>
  );
}

export function WorkflowStatusRow({
  status,
  onSetDefault,
}: WorkflowStatusRowProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 py-4">
      <StatusIndicator status={status.id} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{status.name}</p>

          {status.isDefault && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Default
            </Badge>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {status.description}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${status.name}`}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={status.isDefault}
              onClick={() => onSetDefault(status.id)}
            >
              Set as default
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
