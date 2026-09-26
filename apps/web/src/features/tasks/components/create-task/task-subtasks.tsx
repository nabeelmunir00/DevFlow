"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type { CreateTaskSubtaskInput } from "../../types/task";

interface TaskSubtasksProps {
  value: CreateTaskSubtaskInput[];
  onChange: (value: CreateTaskSubtaskInput[]) => void;
}

export function TaskSubtasks({ value, onChange }: TaskSubtasksProps) {
  const [title, setTitle] = useState("");

  function addSubtask() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onChange([
      ...value,
      {
        title: trimmedTitle,
        position: value.length,
      },
    ]);

    setTitle("");
  }

  function updateSubtask(index: number, title: string) {
    onChange(
      value.map((subtask, currentIndex) =>
        currentIndex === index
          ? {
              ...subtask,
              title,
            }
          : subtask,
      ),
    );
  }

  function removeSubtask(index: number) {
    onChange(
      value
        .filter((_, currentIndex) => currentIndex !== index)
        .map((subtask, position) => ({
          ...subtask,
          position,
        })),
    );
  }

  return (
    <div className="space-y-2">
      {value.map((subtask, index) => (
        <div key={index} className="flex items-center gap-2">
          <Checkbox disabled aria-label={`Subtask ${index + 1}`} />

          <Input
            value={subtask.title}
            className="min-w-0 flex-1"
            aria-label={`Subtask ${index + 1} title`}
            onChange={(event) => updateSubtask(index, event.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Subtask actions"
                />
              }
            >
              <MoreHorizontal className="size-4" strokeWidth={1.75} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => removeSubtask(index)}
                >
                  <Trash2 className="size-4" strokeWidth={1.75} />
                  Delete subtask
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Input
          value={title}
          placeholder="Add a subtask..."
          className="min-w-0 flex-1"
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSubtask();
            }
          }}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-primary hover:text-primary"
          disabled={!title.trim()}
          onClick={addSubtask}
        >
          <Plus className="size-4" strokeWidth={1.75} />
          Add subtask
        </Button>
      </div>
    </div>
  );
}
