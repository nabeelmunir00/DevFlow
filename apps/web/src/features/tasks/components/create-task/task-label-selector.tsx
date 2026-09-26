"use client";

import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TaskLabel } from "../../types/task";

interface TaskLabelSelectorProps {
  labels: TaskLabel[];
  value: string[];
  onChange: (labelIds: string[]) => void;
}

export function TaskLabelSelector({
  labels,
  value,
  onChange,
}: TaskLabelSelectorProps) {
  const selectedLabels = labels.filter((label) => value.includes(label.id));

  function toggleLabel(labelId: string) {
    if (value.includes(labelId)) {
      onChange(value.filter((currentLabelId) => currentLabelId !== labelId));

      return;
    }

    onChange([...value, labelId]);
  }

  function removeLabel(labelId: string) {
    onChange(value.filter((currentLabelId) => currentLabelId !== labelId));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-9 w-full justify-between gap-2 px-3 py-1.5 font-normal"
          />
        }
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {selectedLabels.length === 0 ? (
            <span className="text-muted-foreground">Add labels...</span>
          ) : (
            selectedLabels.map((label) => (
              <span
                key={label.id}
                className="inline-flex h-6 max-w-full items-center gap-1 rounded-sm bg-accent px-2 text-xs font-medium text-accent-foreground"
              >
                <span className="truncate">{label.name}</span>

                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${label.name}`}
                  className="flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-ui hover:bg-background hover:text-foreground"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    removeLabel(label.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();

                      removeLabel(label.id);
                    }
                  }}
                >
                  <X className="size-3" strokeWidth={1.75} />
                </span>
              </span>
            ))
          )}
        </div>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuGroup>
          {labels.map((label) => {
            const selected = value.includes(label.id);

            return (
              <DropdownMenuItem
                key={label.id}
                onSelect={(event) => {
                  event.preventDefault();
                  toggleLabel(label.id);
                }}
              >
                <span
                  className={
                    selected
                      ? "flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground"
                      : "size-4 rounded-sm border border-input"
                  }
                >
                  {selected ? (
                    <Check className="size-3" strokeWidth={2} />
                  ) : null}
                </span>

                <span className="flex-1">{label.name}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
