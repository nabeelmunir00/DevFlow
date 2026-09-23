"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type NotificationFrequency = "INSTANT" | "DAILY_DIGEST" | "OFF";

interface NotificationSettingsState {
  taskAssigned: boolean;
  mentionsAndComments: boolean;
  taskStatusChanges: boolean;
  sprintUpdates: boolean;
  pullRequestActivity: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  frequency: NotificationFrequency;
}

const initialSettings: NotificationSettingsState = {
  taskAssigned: true,
  mentionsAndComments: true,
  taskStatusChanges: true,
  sprintUpdates: true,
  pullRequestActivity: true,
  emailNotifications: true,
  inAppNotifications: true,
  frequency: "INSTANT",
};

export function NotificationSettings() {
  const [settings, setSettings] =
    useState<NotificationSettingsState>(initialSettings);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  function updateSetting<K extends keyof NotificationSettingsState>(
    field: K,
    value: NotificationSettingsState[K],
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCancel() {
    setSettings(initialSettings);
  }

  function handleSave() {
    // API integration later:
    //
    // await updateProjectNotificationSettings({
    //   projectId,
    //   ...settings,
    // });
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Control which project events send notifications to you.
        </p>
      </div>

      {/* Project activity */}
      <section className="mt-8">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Project activity
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose which project events you want to be notified about.
          </p>
        </div>

        <div className="divide-y divide-border">
          <NotificationToggle
            id="task-assigned"
            title="Task assignments"
            description="Notify me when a task is assigned to me."
            checked={settings.taskAssigned}
            onCheckedChange={(checked) =>
              updateSetting("taskAssigned", checked)
            }
          />

          <NotificationToggle
            id="mentions-comments"
            title="Mentions & comments"
            description="Notify me when someone mentions me or comments on my tasks."
            checked={settings.mentionsAndComments}
            onCheckedChange={(checked) =>
              updateSetting("mentionsAndComments", checked)
            }
          />

          <NotificationToggle
            id="task-status"
            title="Task status changes"
            description="Notify me when tasks I follow move to another status."
            checked={settings.taskStatusChanges}
            onCheckedChange={(checked) =>
              updateSetting("taskStatusChanges", checked)
            }
          />

          <NotificationToggle
            id="sprint-updates"
            title="Sprint updates"
            description="Notify me when sprints start, complete or change."
            checked={settings.sprintUpdates}
            onCheckedChange={(checked) =>
              updateSetting("sprintUpdates", checked)
            }
          />

          <NotificationToggle
            id="pull-request-activity"
            title="Pull request activity"
            description="Notify me about reviews, comments and updates on linked pull requests."
            checked={settings.pullRequestActivity}
            onCheckedChange={(checked) =>
              updateSetting("pullRequestActivity", checked)
            }
          />
        </div>
      </section>

      {/* Delivery */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">Delivery</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose how project notifications are delivered.
          </p>
        </div>

        <div className="divide-y divide-border">
          <NotificationToggle
            id="in-app-notifications"
            title="In-app notifications"
            description="Show notifications inside DevFlow."
            checked={settings.inAppNotifications}
            onCheckedChange={(checked) =>
              updateSetting("inAppNotifications", checked)
            }
          />

          <NotificationToggle
            id="email-notifications"
            title="Email notifications"
            description="Send project notifications to your email address."
            checked={settings.emailNotifications}
            onCheckedChange={(checked) =>
              updateSetting("emailNotifications", checked)
            }
          />
        </div>

        {settings.emailNotifications && (
          <div className="mt-5 max-w-md space-y-2">
            <Label>Email frequency</Label>

            <Select
              value={settings.frequency}
              onValueChange={(value) => {
                if (value === null) return;

                updateSetting("frequency", value as NotificationFrequency);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="INSTANT">Instant</SelectItem>

                <SelectItem value="DAILY_DIGEST">Daily digest</SelectItem>

                <SelectItem value="OFF">Never</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Controls how frequently project notification emails are sent.
            </p>
          </div>
        )}
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

interface NotificationToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function NotificationToggle({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0">
        <Label htmlFor={id}>{title}</Label>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
