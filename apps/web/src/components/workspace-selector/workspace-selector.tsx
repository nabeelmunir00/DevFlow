"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { EmptyWorkspaces } from "./empty-workspaces";
import { WorkspaceCard } from "./workspace-card";

import type { Organization } from "@/features/organizations/types/organization";

interface WorkspaceSelectorProps {
  organizations: Organization[];
  email: string;
  hasError?: boolean;
}

export function WorkspaceSelector({
  organizations,
  email,
  hasError = false,
}: WorkspaceSelectorProps) {
  const router = useRouter();

  const hasOrganizations = organizations.length > 0;

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            aria-label="DevFlow home"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="size-8 object-contain"
            />

            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              DevFlow
            </span>
          </Link>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9",
              },
            }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-20 sm:pt-24">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Choose a workspace
          </h1>

          <p className="mt-3 text-base text-muted-foreground">
            Pick where you&apos;d like to work.
          </p>
        </div>

        <div className="mt-8">
          {hasError ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border bg-card px-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <RefreshCw className="size-5 text-muted-foreground" />
              </div>

              <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                Workspaces not found
              </h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                We couldn&apos;t load your workspaces. Please check your
                connection and try again.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="size-4" />
                Try again
              </Button>
            </div>
          ) : hasOrganizations ? (
            <div className="space-y-3">
              {organizations.map((organization) => (
                <WorkspaceCard
                  key={organization.id}
                  organization={organization}
                />
              ))}

              <div className="w-full">
                <CreateWorkspaceDialog variant="card" />
              </div>
            </div>
          ) : (
            <EmptyWorkspaces />
          )}
        </div>

        <Separator className="mt-14" />

        <div className="mt-7 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>

          <Link
            href="/"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Switch account
          </Link>
        </div>
      </main>
    </div>
  );
}
