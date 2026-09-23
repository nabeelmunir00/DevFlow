"use client";

import { Icon } from "@iconify/react";
import { ExternalLink, MoreHorizontal, RefreshCw, Unplug } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectedRepositoryProps {
  name: string;
  owner: string;
  url: string;
  isPrivate?: boolean;
  onSync: () => void;
  onDisconnect: () => void;
}

export function ConnectedRepository({
  name,
  owner,
  url,
  isPrivate = true,
  onSync,
  onDisconnect,
}: ConnectedRepositoryProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
          <Icon icon="mdi:github" className="size-5 text-foreground" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {owner}/{name}
            </p>

            <Badge variant="outline" className="text-xs text-muted-foreground">
              {isPrivate ? "Private" : "Public"}
            </Badge>

            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-xs text-success"
            >
              Connected
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            GitHub repository connected to this project.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onSync}>
          <RefreshCw className="size-4" />
          Sync
        </Button>

        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<a href={url} target="_blank" rel="noreferrer" />}
        >
          <ExternalLink className="size-4" />
          Open
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Repository actions"
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDisconnect}
              >
                <Unplug className="size-4" />
                Disconnect repository
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
