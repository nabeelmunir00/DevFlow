"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AddProjectMemberDialog } from "./add-project-member-dialog";
import { ProjectMemberRow } from "./project-member-row";

export type ProjectMemberRole = "ADMIN" | "DEVELOPER" | "MEMBER" | "VIEWER";

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  role: ProjectMemberRole;
  isLead?: boolean;
}

const initialMembers: ProjectMember[] = [
  {
    id: "member-1",
    name: "Nabeel Munir",
    email: "nabeel@example.com",
    initials: "NM",
    role: "ADMIN",
    isLead: true,
  },
  {
    id: "member-2",
    name: "Sara Ali",
    email: "sara@example.com",
    initials: "SA",
    role: "DEVELOPER",
  },
  {
    id: "member-3",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    initials: "AH",
    role: "DEVELOPER",
  },
  {
    id: "member-4",
    name: "Areeba Khan",
    email: "areeba@example.com",
    initials: "AK",
    role: "MEMBER",
  },
];

export function MembersSettings() {
  const [members, setMembers] = useState<ProjectMember[]>(initialMembers);

  const [defaultRole, setDefaultRole] = useState<ProjectMemberRole>("MEMBER");

  const memberIds = useMemo(
    () => members.map((member) => member.id),
    [members],
  );

  function handleRoleChange(memberId: string, role: ProjectMemberRole) {
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              role,
            }
          : member,
      ),
    );
  }

  function handleRemoveMember(memberId: string) {
    setMembers((current) => current.filter((member) => member.id !== memberId));
  }

  function handleAddMember(member: ProjectMember) {
    setMembers((current) => {
      const alreadyAdded = current.some((item) => item.id === member.id);

      if (alreadyAdded) {
        return current;
      }

      return [...current, member];
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Members & access
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage who can access this project and what they can do.
        </p>
      </div>

      {/* Project members */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Project members
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Members with direct access to this project.
            </p>
          </div>

          <AddProjectMemberDialog
            existingMemberIds={memberIds}
            defaultRole={defaultRole}
            onAddMember={handleAddMember}
            trigger={
              <Button type="button" size="sm">
                <UserPlus className="size-4" />
                Add member
              </Button>
            }
          />
        </div>

        <div className="divide-y divide-border">
          {members.map((member) => (
            <ProjectMemberRow
              key={member.id}
              member={member}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>

        {members.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No project members
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Add organization members to give them access to this project.
            </p>
          </div>
        )}
      </section>

      {/* Default access */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Default access
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure the default role for members added to this project.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Label className="text-sm">New project members</Label>

            <p className="mt-1 text-xs text-muted-foreground">
              Role assigned by default when a member is added.
            </p>
          </div>

          <Select
            value={defaultRole}
            onValueChange={(value) => {
              if (value === null) return;

              setDefaultRole(value as ProjectMemberRole);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>

              <SelectItem value="DEVELOPER">Developer</SelectItem>

              <SelectItem value="MEMBER">Member</SelectItem>

              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
