"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Building2, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createOrganization } from "@/features/organizations/api/create-organization";
import { Card, CardContent } from "../ui/card";

interface CreateWorkspaceDialogProps {
  variant?: "card" | "button";
}

export function CreateWorkspaceDialog({
  variant = "card",
}: CreateWorkspaceDialogProps) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const workspaceName = name.trim();
    const workspaceSlug = slug.trim();

    if (!workspaceName) {
      setError("Workspace name is required.");
      return;
    }

    if (!workspaceSlug) {
      setError("Workspace URL is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      await createOrganization(token, {
        name: workspaceName,
        slug: workspaceSlug,
      });

      setOpen(false);
      resetForm();

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create workspace.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setName("");
    setSlug("");
    setSlugEdited(false);
    setError(null);
  }

  function handleOpenChange(value: boolean) {
    if (isSubmitting) return;

    setOpen(value);

    if (!value) {
      resetForm();
    }
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setName(value);
    setError(null);
    setSlug(generateSlug(value));
  }

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setSlugEdited(true);
    setSlug(generateSlug(value));
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          variant === "card" ? (
            <Card className="group cursor-pointer overflow-hidden py-0 shadow-none transition-colors hover:bg-muted/30">
              <CardContent className="flex min-h-24 items-center gap-5 p-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30 transition-colors group-hover:bg-muted">
                  <Plus className="size-5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <h2 className="truncate font-heading text-base font-medium text-foreground">
                    Create a workspace
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Start a new workspace for your team
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button>
              <Plus />
              Create workspace
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
            <Building2 className="size-5 text-foreground" />
          </div>

          <DialogTitle className="font-heading text-xl">
            Create a workspace
          </DialogTitle>

          <DialogDescription className="leading-6">
            Create a shared space for your projects, issues, code, and team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace name</Label>

            <Input
              id="workspace-name"
              value={name}
              onChange={handleNameChange}
              placeholder="DevFlow Studio"
              autoComplete="organization"
              autoFocus
              disabled={isSubmitting}
            />

            <p className="text-sm text-muted-foreground">
              This is the name your team will see in DevFlow.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-slug">Workspace URL</Label>

            <div className="flex overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
              <div className="flex shrink-0 items-center border-r border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                devflow.app/
              </div>

              <Input
                id="workspace-slug"
                value={slug}
                onChange={handleSlugChange}
                placeholder="devflow-studio"
                autoComplete="off"
                disabled={isSubmitting}
                className="rounded-none border-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              You can use this URL to quickly access your workspace.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting || !name.trim() || !slug.trim() || !slugEdited
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create workspace
                  <ArrowRight />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
