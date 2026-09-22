"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Check, ChevronDown, Link2, Search, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type {
  DevFlowTaskOption,
  GitHubIssueOption,
  GitHubRepositorySummary,
} from "../../../types/github";

interface LinkGitHubIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  repository: GitHubRepositorySummary;
  issues: GitHubIssueOption[];
  tasks: DevFlowTaskOption[];

  onLink?: (issueId: string, taskId: string | null) => void;
}

export function LinkGitHubIssueDialog({
  open,
  onOpenChange,
  repository,
  issues,
  tasks,
  onLink,
}: LinkGitHubIssueDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return issues;

    return issues.filter((issue) => {
      return (
        issue.title.toLowerCase().includes(query) ||
        String(issue.number).includes(query) ||
        issue.htmlUrl.toLowerCase().includes(query)
      );
    });
  }, [issues, search]);

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const canLink = Boolean(selectedIssue && !selectedIssue.linkedTask);

  function handleSubmit() {
    if (!selectedIssue || selectedIssue.linkedTask) return;

    onLink?.(selectedIssue.id, selectedTask?.id ?? null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Link2 className="size-5" />
            </div>

            <div>
              <DialogTitle>Link GitHub issue</DialogTitle>

              <DialogDescription className="mt-1">
                Connect an existing GitHub issue to your project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-5 px-6 py-5">
          {/* Repository */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Repository
            </label>

            <div className="flex h-10 items-center gap-3 rounded-md border bg-background px-3">
              <Icon
                icon="mdi:github"
                className="size-5 shrink-0"
                aria-hidden="true"
              />

              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {repository.fullName}
              </span>

              {repository.isPrivate && (
                <Badge variant="secondary">Private</Badge>
              )}

              <ChevronDown className="size-4 text-muted-foreground" />
            </div>

            <p className="text-xs text-muted-foreground">
              Connected to the current DevFlow project.
            </p>
          </div>

          {/* Issue search */}
          <div className="grid gap-2">
            <label
              htmlFor="github-issue-search"
              className="text-sm font-medium text-foreground"
            >
              GitHub issue
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="github-issue-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, issue number, or paste an issue URL..."
                className="pr-9 pl-9"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear issue search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto rounded-md border">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => {
                  const selected = selectedIssueId === issue.id;
                  const alreadyLinked = Boolean(issue.linkedTask);

                  return (
                    <button
                      key={issue.id}
                      type="button"
                      disabled={alreadyLinked}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={[
                        "flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0",
                        selected && "bg-primary/5",
                        !selected && !alreadyLinked && "hover:bg-muted/50",
                        alreadyLinked && "cursor-not-allowed opacity-60",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="mt-1 flex size-5 shrink-0 items-center justify-center">
                        {alreadyLinked ? (
                          <Link2 className="size-4 text-muted-foreground" />
                        ) : (
                          <span
                            className={[
                              "flex size-4 items-center justify-center rounded-full border",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground",
                            ].join(" ")}
                          >
                            {selected && <Check className="size-3" />}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            #{issue.number}
                          </span>

                          <span className="min-w-0 truncate text-sm font-medium text-foreground">
                            {issue.title}
                          </span>
                        </div>

                        {alreadyLinked ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Linked to{" "}
                            <span className="font-medium text-primary">
                              {issue.linkedTask?.key}
                            </span>
                            {" · "}
                            {issue.linkedTask?.title}
                          </p>
                        ) : (
                          <>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {issue.repository}
                              {issue.authorName ? ` · ${issue.authorName}` : ""}
                              {` · ${issue.createdAt}`}
                            </p>

                            {issue.labels.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {issue.labels.map((label) => (
                                  <Badge
                                    key={label}
                                    variant="secondary"
                                    className="h-5 text-xs"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {alreadyLinked ? (
                        <Badge variant="secondary" className="shrink-0">
                          Already linked
                        </Badge>
                      ) : (
                        <div className="mt-1 flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className={[
                              "size-2 rounded-full",
                              issue.state === "OPEN"
                                ? "bg-success"
                                : "bg-muted-foreground",
                            ].join(" ")}
                          />

                          {issue.state === "OPEN" ? "Open" : "Closed"}
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No issues found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another title, number, or GitHub issue URL.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DevFlow task */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              DevFlow task{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between px-3"
                  />
                }
              >
                {selectedTask ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      icon="lucide:git-pull-request"
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="shrink-0 font-medium text-primary">
                      {selectedTask.key}
                    </span>

                    <span className="truncate font-normal">
                      {selectedTask.title}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Select a DevFlow task
                  </span>
                )}

                <div className="flex shrink-0 items-center gap-2">
                  {selectedTask?.assignee && (
                    <Avatar className="size-6">
                      {selectedTask.assignee.avatarUrl && (
                        <AvatarImage
                          src={selectedTask.assignee.avatarUrl}
                          alt={selectedTask.assignee.name}
                        />
                      )}

                      <AvatarFallback className="text-xs">
                        {selectedTask.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <ChevronDown className="size-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSelectedTaskId(null)}>
                    No task
                  </DropdownMenuItem>

                  {tasks.map((task) => (
                    <DropdownMenuItem
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <span className="font-medium text-primary">
                        {task.key}
                      </span>

                      <span className="truncate">{task.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-xs text-muted-foreground">
              Only tasks from the current project are shown.
            </p>
          </div>

          {/* Preview */}
          {selectedIssue && !selectedIssue.linkedTask && (
            <div className="grid gap-2">
              <p className="text-sm font-medium text-foreground">
                Link preview
              </p>

              <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-3">
                <Icon
                  icon="mdi:github"
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />

                <Badge variant="secondary">#{selectedIssue.number}</Badge>

                <span className="min-w-0 truncate text-sm text-muted-foreground">
                  {selectedIssue.title}
                </span>

                {selectedTask && (
                  <>
                    <span className="text-muted-foreground">→</span>

                    <Badge variant="secondary">{selectedTask.key}</Badge>

                    <span className="truncate text-sm text-muted-foreground">
                      {selectedTask.title}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
          <span className="text-xs text-muted-foreground">
            {selectedIssue ? "1 issue selected" : "No issue selected"}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button disabled={!canLink} onClick={handleSubmit}>
              <Link2 className="size-4" />
              Link issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
