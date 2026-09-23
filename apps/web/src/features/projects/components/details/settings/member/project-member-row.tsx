"use client";

import { MoreHorizontal, UserMinus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProjectMember, ProjectMemberRole } from "./members-settings";

interface ProjectMemberRowProps {
  member: ProjectMember;
  onRoleChange: (memberId: string, role: ProjectMemberRole) => void;
  onRemove: (memberId: string) => void;
}

export function ProjectMemberRow({
  member,
  onRoleChange,
  onRemove,
}: ProjectMemberRowProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="size-9">
          {member.avatarUrl && (
            <AvatarImage src={member.avatarUrl} alt={member.name} />
          )}

          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {member.name}
            </p>

            {member.isLead && (
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                Project lead
              </Badge>
            )}
          </div>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {member.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-12 sm:pl-0">
        <Select
          value={member.role}
          disabled={member.isLead}
          onValueChange={(value) => {
            if (value === null) return;

            onRoleChange(member.id, value as ProjectMemberRole);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>

            <SelectItem value="DEVELOPER">Developer</SelectItem>

            <SelectItem value="MEMBER">Member</SelectItem>

            <SelectItem value="VIEWER">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${member.name}`}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={member.isLead}
                className="text-destructive focus:text-destructive"
                onClick={() => onRemove(member.id)}
              >
                <UserMinus className="size-4" />
                Remove from project
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
