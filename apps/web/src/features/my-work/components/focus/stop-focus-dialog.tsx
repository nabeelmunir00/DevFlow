"use client";

import { Clock3, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StopFocusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elapsedSeconds: number;
  onConfirm: () => void;
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function StopFocusDialog({
  open,
  onOpenChange,
  elapsedSeconds,
  onConfirm,
}: StopFocusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-secondary">
            <Square className="size-4 text-muted-foreground" />
          </div>

          <AlertDialogTitle>Stop focus session?</AlertDialogTitle>

          <AlertDialogDescription>
            Your task will remain incomplete. The time spent in this focus
            session will be kept.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2.5">
          <Clock3 className="size-4 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">Time focused</span>

          <span className="ml-auto text-sm font-medium text-foreground">
            {formatDuration(elapsedSeconds)}
          </span>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep focusing</AlertDialogCancel>

          <Button type="button" variant="outline" onClick={onConfirm}>
            Stop session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
