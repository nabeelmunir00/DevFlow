"use client";

import { useState } from "react";
import { Archive, AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROJECT_NAME = "DevFlow Web";

export function DangerZoneSettings() {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const canDelete = deleteConfirmation.trim() === PROJECT_NAME;

  function handleArchive() {
    // API integration later:
    //
    // await archiveProject(projectId);
    //
    // After success:
    // router.push("/workspace/project");

    setArchiveDialogOpen(false);
  }

  function handleDelete() {
    if (!canDelete) return;

    // API integration later:
    //
    // await deleteProject(projectId);
    //
    // After success:
    // router.replace("/workspace/project");

    setDeleteDialogOpen(false);
    setDeleteConfirmation("");
  }

  function handleDeleteDialogChange(open: boolean) {
    setDeleteDialogOpen(open);

    if (!open) {
      setDeleteConfirmation("");
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Danger zone</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage destructive and irreversible project actions.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-lg border border-destructive/30">
          {/* Archive */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Archive className="size-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-medium text-foreground">
                  Archive project
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                  Archive this project to hide it from active project views.
                  Project data will remain available and can be restored later.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => setArchiveDialogOpen(true)}
            >
              <Archive className="size-4" />
              Archive
            </Button>
          </div>

          <div className="border-t border-destructive/20" />

          {/* Delete */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="size-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-medium text-destructive">
                  Delete project
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                  Permanently delete this project and its project data. This
                  action cannot be undone.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="shrink-0"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete project
            </Button>
          </div>
        </section>

        <div className="mt-4 flex gap-2 rounded-lg bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

          <p className="text-xs leading-5 text-muted-foreground">
            Destructive actions may affect tasks, sprints, repository links and
            other project resources. Review the action carefully before
            continuing.
          </p>
        </div>
      </div>

      {/* Archive confirmation */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive project?</DialogTitle>

            <DialogDescription>
              DevFlow Web will be removed from active project views. You can
              restore the project later.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex gap-3">
              <Archive className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Tasks, project settings and linked resources will remain stored.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setArchiveDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleArchive}>
              Archive project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>

            <DialogDescription>
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

              <div>
                <p className="text-sm font-medium text-foreground">
                  DevFlow Web will be permanently deleted.
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Project tasks, sprints, configuration and project-level links
                  may be removed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Type{" "}
              <span className="font-semibold text-foreground">
                {PROJECT_NAME}
              </span>{" "}
              to confirm
            </Label>

            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder={PROJECT_NAME}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDeleteDialogChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={!canDelete}
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
