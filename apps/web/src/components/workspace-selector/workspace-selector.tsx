import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";

import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { EmptyWorkspaces } from "./empty-workspaces";
import { WorkspaceCard } from "./workspace-card";

import type { Organization } from "@/features/organizations/types/organization";

interface WorkspaceSelectorProps {
  organizations: Organization[];
  email: string;
}

export function WorkspaceSelector({
  organizations,
  email,
}: WorkspaceSelectorProps) {
  const hasOrganizations = organizations.length > 0;

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
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

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-20 sm:pt-24">
        {/* Heading */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Choose a workspace
          </h1>

          <p className="mt-3 text-base text-muted-foreground">
            Pick where you&apos;d like to work.
          </p>
        </div>

        {/* Workspaces */}
        <div className="mt-8">
          {hasOrganizations ? (
            <div className="space-y-3">
              {organizations.map((organization) => (
                <WorkspaceCard
                  key={organization.id}
                  organization={organization}
                />
              ))}

              {/* Create another workspace */}
              <div className="w-full">
                <CreateWorkspaceDialog variant="card" />
              </div>
            </div>
          ) : (
            <EmptyWorkspaces />
          )}
        </div>

        {/* Account */}
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
