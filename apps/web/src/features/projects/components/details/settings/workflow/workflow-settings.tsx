"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  WorkflowStatusRow,
  type WorkflowStatus,
  type WorkflowStatusItem,
} from "./workflow-status-row";

type EstimationMethod = "STORY_POINTS" | "HOURS" | "NONE";

interface WorkflowSettingsState {
  allowBackwardMovement: boolean;
  autoCompleteSubtasks: boolean;
  requireReviewBeforeDone: boolean;
  estimationMethod: EstimationMethod;
  defaultEstimate: string;
}

const initialStatuses: WorkflowStatusItem[] = [
  {
    id: "TODO",
    name: "Todo",
    description: "Tasks that haven't been started yet.",
    isDefault: true,
  },
  {
    id: "IN_PROGRESS",
    name: "In progress",
    description: "Tasks currently being worked on.",
  },
  {
    id: "IN_REVIEW",
    name: "In review",
    description: "Tasks waiting for review or approval.",
  },
  {
    id: "DONE",
    name: "Done",
    description: "Tasks that have been completed.",
  },
];

const initialSettings: WorkflowSettingsState = {
  allowBackwardMovement: true,
  autoCompleteSubtasks: false,
  requireReviewBeforeDone: false,
  estimationMethod: "STORY_POINTS",
  defaultEstimate: "3",
};

export function WorkflowSettings() {
  const [statuses, setStatuses] =
    useState<WorkflowStatusItem[]>(initialStatuses);

  const [settings, setSettings] =
    useState<WorkflowSettingsState>(initialSettings);

  const hasChanges =
    JSON.stringify(statuses) !== JSON.stringify(initialStatuses) ||
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  function updateSetting<K extends keyof WorkflowSettingsState>(
    field: K,
    value: WorkflowSettingsState[K],
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSetDefault(statusId: WorkflowStatus) {
    setStatuses((current) =>
      current.map((status) => ({
        ...status,
        isDefault: status.id === statusId,
      })),
    );
  }

  function handleCancel() {
    setStatuses(initialStatuses);
    setSettings(initialSettings);
  }

  function handleSave() {
    // Connect workflow settings API later.
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Task workflow</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure how tasks move through this project.
        </p>
      </div>

      {/* Workflow statuses */}
      <section className="mt-8">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Workflow statuses
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Statuses used by tasks in this project.
          </p>
        </div>

        <div className="divide-y divide-border">
          {statuses.map((status) => (
            <WorkflowStatusRow
              key={status.id}
              status={status}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      </section>

      {/* Task behavior */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Task behavior
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Control how tasks behave as they move through the workflow.
          </p>
        </div>

        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <Label htmlFor="allow-backward">
                Allow moving tasks backwards
              </Label>

              <p className="mt-1 text-xs text-muted-foreground">
                Allow tasks to move back to an earlier workflow status.
              </p>
            </div>

            <Switch
              id="allow-backward"
              checked={settings.allowBackwardMovement}
              onCheckedChange={(checked) =>
                updateSetting("allowBackwardMovement", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <Label htmlFor="auto-subtasks">
                Automatically complete subtasks
              </Label>

              <p className="mt-1 text-xs text-muted-foreground">
                Complete remaining subtasks when their parent task is completed.
              </p>
            </div>

            <Switch
              id="auto-subtasks"
              checked={settings.autoCompleteSubtasks}
              onCheckedChange={(checked) =>
                updateSetting("autoCompleteSubtasks", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <Label htmlFor="require-review">Require review before Done</Label>

              <p className="mt-1 text-xs text-muted-foreground">
                Tasks must pass through In review before they can be completed.
              </p>
            </div>

            <Switch
              id="require-review"
              checked={settings.requireReviewBeforeDone}
              onCheckedChange={(checked) =>
                updateSetting("requireReviewBeforeDone", checked)
              }
            />
          </div>
        </div>
      </section>

      {/* Estimation */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">Estimation</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure how work is estimated for tasks in this project.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Estimation method</Label>

            <Select
              value={settings.estimationMethod}
              onValueChange={(value) => {
                if (value === null) return;

                updateSetting("estimationMethod", value as EstimationMethod);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="STORY_POINTS">Story points</SelectItem>

                <SelectItem value="HOURS">Hours</SelectItem>

                <SelectItem value="NONE">No estimation</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Determines how task effort is measured.
            </p>
          </div>

          {settings.estimationMethod !== "NONE" && (
            <div className="space-y-2">
              <Label htmlFor="default-estimate">Default estimate</Label>

              <Input
                id="default-estimate"
                type="number"
                min="0"
                step={
                  settings.estimationMethod === "STORY_POINTS" ? "1" : "0.5"
                }
                value={settings.defaultEstimate}
                onChange={(event) =>
                  updateSetting("defaultEstimate", event.target.value)
                }
              />

              <p className="text-xs text-muted-foreground">
                Applied when a new task does not specify an estimate.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-9 flex items-center justify-end gap-2 border-t border-border pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={!hasChanges}
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button type="button" disabled={!hasChanges} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
