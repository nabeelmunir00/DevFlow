import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EmptyWorkspaces } from "./empty-workspaces";
import { WorkspaceCard } from "./workspace-card";

import type { Organization } from "@/features/organizations/types/organization";

interface WorkspaceSelectorProps {
  organizations: Organization[];
}

export function WorkspaceSelector({ organizations }: WorkspaceSelectorProps) {
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
          {hasOrganizations ? (
            <div className="space-y-3">
              {organizations.map((organization) => (
                <WorkspaceCard
                  key={organization.id}
                  organization={organization}
                />
              ))}

              <Button
                variant="outline"
                className="h-24 w-full justify-start gap-5 px-5 shadow-none"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                  <Plus className="size-5 text-muted-foreground" />
                </div>

                <span className="font-medium text-foreground">
                  Create a workspace
                </span>
              </Button>
            </div>
          ) : (
            <EmptyWorkspaces />
          )}
        </div>

        <Separator className="mt-14" />

        <div className="mt-7 text-center">
          <p className="text-sm text-muted-foreground">
            Select a workspace to continue to DevFlow.
          </p>
        </div>
      </main>
    </div>
  );
}
