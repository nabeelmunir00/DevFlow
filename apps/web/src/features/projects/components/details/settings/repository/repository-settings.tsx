"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";

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

import { ConnectedRepository } from "./connected-repository";

interface RepositorySettingsState {
  defaultBranch: string;
  autoSync: boolean;
  linkIssues: boolean;
  linkPullRequests: boolean;
  syncPullRequestReviews: boolean;
}

const initialSettings: RepositorySettingsState = {
  defaultBranch: "main",
  autoSync: true,
  linkIssues: true,
  linkPullRequests: true,
  syncPullRequestReviews: true,
};

export function RepositorySettings() {
  const [settings, setSettings] =
    useState<RepositorySettingsState>(initialSettings);

  const [isConnected, setIsConnected] = useState(true);

  const [isSyncing, setIsSyncing] = useState(false);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  function updateSetting<K extends keyof RepositorySettingsState>(
    field: K,
    value: RepositorySettingsState[K],
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
    // Connect repository settings API later.
  }

  function handleDisconnect() {
    // Later this should open a confirmation dialog
    // and call the disconnect repository API.
    setIsConnected(false);
  }

  function handleConnect() {
    // Later:
    // Open repository picker using the GitHub installation.
    setIsConnected(true);
  }

  function handleSync() {
    if (isSyncing) return;

    setIsSyncing(true);

    // Temporary frontend behavior.
    // Replace with repository sync API later.
    window.setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Repository</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure the GitHub repository connected to this project.
        </p>
      </div>

      {/* Connected repository */}
      <section className="mt-8">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Connected repository
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            GitHub repository used for issues, pull requests and development
            activity.
          </p>
        </div>

        <div className="mt-5">
          {isConnected ? (
            <ConnectedRepository
              owner="devflow"
              name="web"
              url="https://github.com/devflow/web"
              isPrivate
              onSync={handleSync}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <GitBranch className="size-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    No repository connected
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Connect a GitHub repository to enable issues, pull requests
                    and activity.
                  </p>
                </div>
              </div>

              <Button type="button" size="sm" onClick={handleConnect}>
                Connect repository
              </Button>
            </div>
          )}
        </div>
      </section>

      {isConnected && (
        <>
          {/* Repository configuration */}
          <section className="mt-9">
            <div className="border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Repository configuration
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Configure how DevFlow works with this repository.
              </p>
            </div>

            <div className="mt-5 max-w-md space-y-2">
              <Label>Default branch</Label>

              <Select
                value={settings.defaultBranch}
                onValueChange={(value) => {
                  if (value === null) return;

                  updateSetting("defaultBranch", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <GitBranch className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="main">main</SelectItem>

                  <SelectItem value="develop">develop</SelectItem>

                  <SelectItem value="staging">staging</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Used as the base branch for repository integrations.
              </p>
            </div>
          </section>

          {/* Synchronization */}
          <section className="mt-9">
            <div className="border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Synchronization
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose which GitHub data DevFlow keeps in sync.
              </p>
            </div>

            <div className="divide-y divide-border">
              <div className="flex items-center justify-between gap-6 py-4">
                <div className="min-w-0">
                  <Label htmlFor="auto-sync">Automatic synchronization</Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Keep repository data synchronized using GitHub events.
                  </p>
                </div>

                <Switch
                  id="auto-sync"
                  checked={settings.autoSync}
                  onCheckedChange={(checked) =>
                    updateSetting("autoSync", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-6 py-4">
                <div className="min-w-0">
                  <Label htmlFor="sync-issues">GitHub issues</Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Allow GitHub issues to be linked with project tasks.
                  </p>
                </div>

                <Switch
                  id="sync-issues"
                  checked={settings.linkIssues}
                  onCheckedChange={(checked) =>
                    updateSetting("linkIssues", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-6 py-4">
                <div className="min-w-0">
                  <Label htmlFor="sync-prs">Pull requests</Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Allow pull requests to be linked with project tasks.
                  </p>
                </div>

                <Switch
                  id="sync-prs"
                  checked={settings.linkPullRequests}
                  onCheckedChange={(checked) =>
                    updateSetting("linkPullRequests", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-6 py-4">
                <div className="min-w-0">
                  <Label htmlFor="sync-reviews">Pull request reviews</Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Synchronize reviews and review activity from linked pull
                    requests.
                  </p>
                </div>

                <Switch
                  id="sync-reviews"
                  checked={settings.syncPullRequestReviews}
                  onCheckedChange={(checked) =>
                    updateSetting("syncPullRequestReviews", checked)
                  }
                />
              </div>
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
        </>
      )}
    </div>
  );
}
