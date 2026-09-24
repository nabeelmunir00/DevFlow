"use client";

import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskCount?: number;
  taskKey?: string;
  taskTitle?: string;
  onConfirm: () => void;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskCount = 1,
  taskKey,
  taskTitle,
  onConfirm,
}: DeleteTaskDialogProps) {
  const isBulkDelete = taskCount > 1;

  function handleConfirm() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </div>

          <AlertDialogTitle>
            {isBulkDelete ? `Delete ${taskCount} tasks?` : "Delete task?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isBulkDelete ? (
              <>
                You&apos;re about to permanently delete{" "}
                <span className="font-medium text-foreground">
                  {taskCount} tasks
                </span>
                . This action cannot be undone.
              </>
            ) : (
              <>
                You&apos;re about to permanently delete{" "}
                {taskKey && (
                  <span className="font-medium text-foreground">{taskKey}</span>
                )}
                {taskTitle && (
                  <>
                    {" "}
                    <span className="text-foreground">{taskTitle}</span>
                  </>
                )}
                . This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
