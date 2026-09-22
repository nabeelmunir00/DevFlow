"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  ArrowRight,
  Check,
  CircleDot,
  Flag,
  GitCommitHorizontal,
  MessageSquare,
  MoreHorizontal,
  Send,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  ActivityStatus,
  ProjectActivityItem as ProjectActivityItemType,
} from "../../../types/activity";

interface ActivityItemProps {
  activity: ProjectActivityItemType;
  isLast?: boolean;
}

function ActivityTypeIcon({ activity }: { activity: ProjectActivityItemType }) {
  switch (activity.type) {
    case "COMMENT_ADDED":
      return <CircleDot className="size-4" />;

    case "PULL_REQUEST_REVIEW":
    case "COMMITS_PUSHED":
      return <Icon icon="mdi:github" className="size-5" aria-hidden="true" />;

    case "TASK_UPDATED":
      return <ArrowRight className="size-5" />;

    case "TASK_COMPLETED":
      return <Check className="size-4" />;

    case "SPRINT_STARTED":
      return <Flag className="size-4" />;

    default:
      return <CircleDot className="size-4" />;
  }
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const toneClasses = {
    default: "border-border bg-muted text-muted-foreground",
    primary: "border-primary/40 bg-primary/10 text-primary",
    success: "border-success/40 bg-success/10 text-success",
    warning: "border-warning/40 bg-warning/10 text-warning",
  };

  return (
    <Badge
      variant="outline"
      className={[
        "gap-1.5 rounded-full font-normal",
        toneClasses[status.tone],
      ].join(" ")}
    >
      <span
        className={[
          "size-2 rounded-full",
          status.tone === "primary" && "bg-primary",
          status.tone === "success" && "bg-success",
          status.tone === "warning" && "bg-warning",
          status.tone === "default" && "bg-muted-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {status.label}
    </Badge>
  );
}

function ActivityActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Activity actions"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>View details</DropdownMenuItem>

          <DropdownMenuItem>Copy link</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CommentCard({ activity }: { activity: ProjectActivityItemType }) {
  const [reply, setReply] = useState("");

  if (!activity.comment) return null;

  return (
    <div className="mt-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          {activity.comment.author.avatarUrl && (
            <AvatarImage
              src={activity.comment.author.avatarUrl}
              alt={activity.comment.author.name}
            />
          )}

          <AvatarFallback className="text-xs">
            {activity.comment.author.initials}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm font-medium">
          {activity.comment.author.name}
        </span>

        <span className="text-xs text-muted-foreground">
          {activity.comment.createdAt}
        </span>
      </div>

      <p className="mt-2 text-sm text-foreground">{activity.comment.message}</p>

      <div className="mt-4 flex gap-2">
        <Input
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Reply to this comment..."
        />

        <Button disabled={!reply.trim()}>
          <Send className="size-4 sm:hidden" />

          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
}

export function ActivityItem({ activity, isLast = false }: ActivityItemProps) {
  return (
    <div className="relative flex gap-4 px-5 py-3">
      {!isLast && (
        <div className="absolute bottom-0 left-8 top-10 w-px bg-border" />
      )}

      <div className="relative z-10 flex size-6 shrink-0 items-center justify-center bg-card text-foreground">
        <ActivityTypeIcon activity={activity} />
      </div>

      <Avatar className="size-9 shrink-0">
        {activity.actor.avatarUrl && (
          <AvatarImage
            src={activity.actor.avatarUrl}
            alt={activity.actor.name}
          />
        )}

        <AvatarFallback className="text-xs">
          {activity.actor.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
              <span className="font-medium">{activity.actor.name}</span>

              <span className="text-muted-foreground">{activity.message}</span>

              {activity.target && (
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {activity.target.label}
                </button>
              )}

              {activity.fromStatus && activity.toStatus && (
                <>
                  <span className="text-muted-foreground">from</span>

                  <StatusBadge status={activity.fromStatus} />

                  <ArrowRight className="size-4 text-muted-foreground" />

                  <StatusBadge status={activity.toStatus} />
                </>
              )}
            </div>

            {activity.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {activity.description}
              </p>
            )}

            {activity.commits && (
              <div className="mt-1 space-y-1">
                {activity.commits.map((commit) => (
                  <div
                    key={commit}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <GitCommitHorizontal className="size-3" />
                    {commit}
                  </div>
                ))}
              </div>
            )}

            <CommentCard activity={activity} />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {activity.createdAt}
            </span>

            <ActivityActions />
          </div>
        </div>

        <span className="mt-1 block text-xs text-muted-foreground sm:hidden">
          {activity.createdAt}
        </span>
      </div>
    </div>
  );
}
