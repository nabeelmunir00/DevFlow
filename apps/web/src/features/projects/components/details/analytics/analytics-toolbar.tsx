"use client";

import { CalendarDays, Check, ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface AnalyticsToolbarProps {
  period: string;
  sprint: string;
  member: string;
  comparePrevious: boolean;
  onPeriodChange: (period: string) => void;
  onSprintChange: (sprint: string) => void;
  onMemberChange: (member: string) => void;
  onComparePreviousChange: (checked: boolean) => void;
  onExport?: () => void;
}

const periods = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;

const sprints = ["All sprints", "Sprint 04", "Sprint 05", "Sprint 06"] as const;

const members = [
  "All members",
  "Nabeel Munir",
  "Sara Ali",
  "Ahmed Hassan",
  "Maya Chen",
  "Omar Khan",
  "Lisa Park",
] as const;

export function AnalyticsToolbar({
  period,
  sprint,
  member,
  comparePrevious,
  onPeriodChange,
  onSprintChange,
  onMemberChange,
  onComparePreviousChange,
  onExport,
}: AnalyticsToolbarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid min-w-0 gap-2 sm:grid-cols-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="justify-between font-normal"
              />
            }
          >
            <span className="flex min-w-0 items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

              <span className="truncate">{period}</span>
            </span>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              {periods.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => onPeriodChange(item)}
                >
                  <span className="flex-1">{item}</span>

                  {period === item && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="justify-between font-normal"
              />
            }
          >
            <span className="truncate">{sprint}</span>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              {sprints.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => onSprintChange(item)}
                >
                  <span className="flex-1">{item}</span>

                  {sprint === item && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="justify-between font-normal"
              />
            }
          >
            <span className="truncate">{member}</span>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              {members.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => onMemberChange(item)}
                >
                  <span className="flex-1">{item}</span>

                  {member === item && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2">
          <Switch
            checked={comparePrevious}
            onCheckedChange={onComparePreviousChange}
          />

          <span className="text-sm text-muted-foreground">
            Compare previous period
          </span>
        </label>

        <Button variant="outline" onClick={onExport}>
          <Download className="size-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
