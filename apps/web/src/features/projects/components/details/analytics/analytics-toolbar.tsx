"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalyticsToolbarProps {
  period: string;
  sprint: string;
  member: string;
  comparePrevious: boolean;
  onPeriodChange: (period: string) => void;
  onSprintChange: (sprint: string) => void;
  onMemberChange: (member: string) => void;
  onComparePreviousChange: (checked: boolean) => void;
  onExport?: (format: "CSV" | "PDF") => void;
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
    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-between">
      {/* Left controls */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {/* Period */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="min-w-36 justify-between gap-3 font-normal"
              />
            }
          >
            <span className="flex min-w-0 items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

              <span className="truncate">{period}</span>
            </span>

            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
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

        {/* Sprint */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="min-w-28 justify-between gap-3 font-normal"
              />
            }
          >
            <span className="truncate">{sprint}</span>

            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
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

        {/* Member */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="min-w-32 justify-between gap-3 font-normal"
              />
            }
          >
            <span className="truncate">{member}</span>

            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
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

        {/* Compare */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="min-w-48 justify-between gap-3 font-normal"
              />
            }
          >
            <span className="truncate">
              {comparePrevious ? "Compare previous period" : "No comparison"}
            </span>

            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onComparePreviousChange(true)}>
                <span className="flex-1">Compare previous period</span>

                {comparePrevious && <Check className="size-4" />}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onComparePreviousChange(false)}>
                <span className="flex-1">No comparison</span>

                {!comparePrevious && <Check className="size-4" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right export */}
      <div className="flex shrink-0 md:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-normal"
              />
            }
          >
            <Download className="size-4" />

            <span>Export</span>

            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onExport?.("CSV")}>
                <FileSpreadsheet className="size-4" />
                Export as CSV
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onExport?.("PDF")}>
                <FileText className="size-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
