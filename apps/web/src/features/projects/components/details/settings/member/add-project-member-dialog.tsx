"use client";

import { useMemo, useState, type ReactElement } from "react";
import { Check, Search, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { ProjectMember, ProjectMemberRole } from "./members-settings";

interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface AddProjectMemberDialogProps {
  existingMemberIds: string[];
  defaultRole: ProjectMemberRole;
  onAddMember: (member: ProjectMember) => void;
  trigger: ReactElement;
}

const organizationMembers: OrganizationMember[] = [
  {
    id: "member-1",
    name: "Nabeel Munir",
    email: "nabeel@example.com",
    initials: "NM",
  },
  {
    id: "member-2",
    name: "Sara Ali",
    email: "sara@example.com",
    initials: "SA",
  },
  {
    id: "member-3",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    initials: "AH",
  },
  {
    id: "member-4",
    name: "Areeba Khan",
    email: "areeba@example.com",
    initials: "AK",
  },
  {
    id: "member-5",
    name: "Hamza Khan",
    email: "hamza@example.com",
    initials: "HK",
  },
  {
    id: "member-6",
    name: "Usman Ali",
    email: "usman@example.com",
    initials: "UA",
  },
];

export function AddProjectMemberDialog({
  existingMemberIds,
  defaultRole,
  onAddMember,
  trigger,
}: AddProjectMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [role, setRole] = useState<ProjectMemberRole>(defaultRole);

  const availableMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizationMembers.filter((member) => {
      if (existingMemberIds.includes(member.id)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    });
  }, [existingMemberIds, search]);

  function resetDialog() {
    setSearch("");
    setSelectedMemberId(null);
    setRole(defaultRole);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetDialog();
    }
  }

  function handleAdd() {
    const selectedMember = organizationMembers.find(
      (member) => member.id === selectedMemberId,
    );

    if (!selectedMember) return;

    onAddMember({
      ...selectedMember,
      role,
    });

    setOpen(false);
    resetDialog();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add project member</DialogTitle>

          <DialogDescription>
            Give an organization member access to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="member-search">Member</Label>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="member-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
            {availableMembers.length > 0 ? (
              <div className="divide-y divide-border">
                {availableMembers.map((member) => {
                  const selected = selectedMemberId === member.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                        "hover:bg-secondary",
                        selected && "bg-secondary",
                      )}
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>

                      {selected && (
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No members found
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try searching for another organization member.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Project role</Label>

            <Select
              value={role}
              onValueChange={(value) => {
                if (value === null) return;

                setRole(value as ProjectMemberRole);
              }}
            >
              <SelectTrigger className="w-full">
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
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!selectedMemberId}
            onClick={handleAdd}
          >
            <UserPlus className="size-4" />
            Add member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
