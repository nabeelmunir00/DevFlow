"use client";

import { useMemo, useState, type ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpDown,
  Bell,
  CalendarDays,
  Check,
  CheckSquare2,
  ChevronDown,
  FileText,
  Filter,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* =========================================================
   TYPES
========================================================= */

type ProjectStatus = "In progress" | "In review" | "Planned" | "Completed";

type ProjectTab = "all" | "in-progress" | "in-review" | "completed";

type ProgressFilter = "all" | "needs-attention" | "nearly-done";

type SortOption =
  | "default"
  | "name"
  | "progress-desc"
  | "progress-asc"
  | "due-date";

interface Project {
  id: string;
  key: string;
  name: string;
  status: ProjectStatus;
  team: string[];
  extraMembers?: number;
  progress: number;
  dueDate: string;
  markerClass: string;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  badge?: number;
  active?: boolean;
}

interface FavoriteProject {
  label: string;
  markerClass: string;
}

interface TabOption {
  value: ProjectTab;
  label: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const PROJECTS: readonly Project[] = [
  {
    id: "project-devflow-web",
    key: "DW",
    name: "DevFlow Web",
    status: "In progress",
    team: ["NM", "SK"],
    extraMembers: 2,
    progress: 72,
    dueDate: "2026-09-24",
    markerClass: "bg-info",
  },
  {
    id: "project-api-platform",
    key: "AP",
    name: "API Platform",
    status: "In progress",
    team: ["AH", "AR"],
    extraMembers: 1,
    progress: 48,
    dueDate: "2026-09-28",
    markerClass: "bg-purple",
  },
  {
    id: "project-design-system",
    key: "DS",
    name: "Design System",
    status: "In review",
    team: ["SK", "AH"],
    extraMembers: 1,
    progress: 91,
    dueDate: "2026-09-20",
    markerClass: "bg-success",
  },
  {
    id: "project-team-chat",
    key: "TC",
    name: "Team Chat",
    status: "In progress",
    team: ["AR", "NM"],
    progress: 56,
    dueDate: "2026-09-30",
    markerClass: "bg-primary",
  },
  {
    id: "project-notification-center",
    key: "NC",
    name: "Notification Center",
    status: "Planned",
    team: ["NM", "SK"],
    progress: 0,
    dueDate: "2026-10-02",
    markerClass: "bg-purple",
  },
  {
    id: "project-workspace-settings",
    key: "WS",
    name: "Workspace Settings",
    status: "Completed",
    team: ["SK", "AH"],
    progress: 100,
    dueDate: "2026-09-18",
    markerClass: "bg-success",
  },
];

const NAV_ITEMS: readonly NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    badge: PROJECTS.length,
    active: true,
  },
  {
    icon: CheckSquare2,
    label: "My tasks",
    badge: 12,
  },
  {
    icon: Inbox,
    label: "Inbox",
    badge: 4,
  },
  {
    icon: MessageSquare,
    label: "Team chat",
  },
  {
    icon: FileText,
    label: "Documents",
  },
  {
    icon: CalendarDays,
    label: "Calendar",
  },
  {
    icon: Users,
    label: "Members",
  },
];

const FAVORITES: readonly FavoriteProject[] = [
  {
    label: "DevFlow Web",
    markerClass: "bg-info",
  },
  {
    label: "API Platform",
    markerClass: "bg-purple",
  },
  {
    label: "Design System",
    markerClass: "bg-success",
  },
];

const TABS: readonly TabOption[] = [
  {
    value: "all",
    label: "All projects",
  },
  {
    value: "in-progress",
    label: "In progress",
  },
  {
    value: "in-review",
    label: "In review",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

/* =========================================================
   HELPERS
========================================================= */

function matchesTab(project: Project, tab: ProjectTab): boolean {
  switch (tab) {
    case "in-progress":
      return project.status === "In progress";

    case "in-review":
      return project.status === "In review";

    case "completed":
      return project.status === "Completed";

    case "all":
      return true;
  }
}

function matchesProgressFilter(
  project: Project,
  filter: ProgressFilter,
): boolean {
  switch (filter) {
    case "needs-attention":
      return project.progress > 0 && project.progress < 60;

    case "nearly-done":
      return project.progress >= 80 && project.progress < 100;

    case "all":
      return true;
  }
}

function sortProjects(
  projects: readonly Project[],
  sort: SortOption,
): Project[] {
  const result = [...projects];

  switch (sort) {
    case "name":
      return result.sort((a, b) => a.name.localeCompare(b.name));

    case "progress-desc":
      return result.sort((a, b) => b.progress - a.progress);

    case "progress-asc":
      return result.sort((a, b) => a.progress - b.progress);

    case "due-date":
      return result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    case "default":
      return result;
  }
}

function formatDueDate(value: string): string {
  return DATE_FORMATTER.format(new Date(`${value}T00:00:00Z`));
}

function getTabCount(tab: ProjectTab): number {
  return PROJECTS.filter((project) => matchesTab(project, tab)).length;
}

/* =========================================================
   PRODUCT PREVIEW
========================================================= */

export function ProductPreview() {
  const [search, setSearch] = useState("");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");

  return (
    <section
      aria-label="DevFlow product preview"
      className="relative mx-auto w-full max-w-[820px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] -bottom-8 top-1/4 -z-10 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <PreviewTopbar search={search} onSearchChange={setSearch} />

        <div className="flex min-h-[460px]">
          <PreviewSidebar />

          <ProjectsWorkspace
            search={search}
            progressFilter={progressFilter}
            onProgressFilterChange={setProgressFilter}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

interface PreviewTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

function PreviewTopbar({ search, onSearchChange }: PreviewTopbarProps) {
  return (
    <header className="flex h-12 items-center border-b border-border bg-card">
      <div className="flex h-full shrink-0 items-center gap-2.5 border-r border-border px-3 sm:w-[180px] sm:px-4">
        <DevFlowMark />

        <span className="hidden text-xs font-semibold tracking-tight text-foreground sm:inline">
          DevFlow
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <div className="relative mx-auto hidden w-full max-w-[280px] min-[420px]:block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            autoComplete="off"
            className="h-7 border-border bg-background pl-8 pr-10 text-[10px] shadow-none"
          />

          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-[8px] leading-none text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative size-7 text-muted-foreground"
          >
            <Bell className="size-3.5" />

            <span
              aria-hidden="true"
              className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive ring-2 ring-card"
            />
          </Button>

          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-[8px] font-semibold text-primary-foreground">
              NM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function PreviewSidebar() {
  return (
    <aside className="hidden w-[180px] shrink-0 border-r border-border bg-background/30 p-3 sm:block">
      <WorkspaceSwitcher />

      <SidebarLabel className="mt-5">Workspace</SidebarLabel>

      <nav
        aria-label="Preview workspace navigation"
        className="mt-2 space-y-0.5"
      >
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </nav>

      <SidebarLabel className="mt-5">Favorites</SidebarLabel>

      <div className="mt-2 space-y-0.5">
        {FAVORITES.map((favorite) => (
          <div
            key={favorite.label}
            className="flex h-7 items-center gap-2 rounded-md px-2 text-[10px] text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className={`size-2.5 shrink-0 rounded-sm ${favorite.markerClass}`}
            />

            <span className="truncate">{favorite.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function WorkspaceSwitcher() {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 w-full justify-start gap-2 border-border bg-card px-2.5 shadow-none"
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-[7px] font-bold text-primary-foreground">
        DS
      </span>

      <span className="min-w-0 flex-1 truncate text-left text-[10px]">
        DevFlow Studio
      </span>

      <ChevronDown className="size-3 text-muted-foreground" />
    </Button>
  );
}

function SidebarItem({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <div
      className={[
        "flex h-7 items-center gap-2 rounded-md px-2 text-[10px]",
        item.active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground",
      ].join(" ")}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />

      <span className="min-w-0 flex-1 truncate">{item.label}</span>

      {item.badge !== undefined && (
        <Badge
          variant="secondary"
          className="h-4 min-w-5 justify-center rounded px-1 text-[7px] font-medium"
        >
          {item.badge}
        </Badge>
      )}
    </div>
  );
}

function SidebarLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "px-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

/* =========================================================
   PROJECT WORKSPACE
========================================================= */

interface ProjectsWorkspaceProps {
  search: string;
  progressFilter: ProgressFilter;
  onProgressFilterChange: (value: ProgressFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

function ProjectsWorkspace({
  search,
  progressFilter,
  onProgressFilterChange,
  sort,
  onSortChange,
}: ProjectsWorkspaceProps) {
  return (
    <main className="min-w-0 flex-1 bg-card p-4">
      <ProjectsHeader />

      <Tabs defaultValue="all" className="mt-4 gap-0">
        <div className="flex items-end justify-between gap-3 border-b border-border">
          <TabsList
            variant="line"
            className="h-9 min-w-0 justify-start overflow-x-auto rounded-none bg-transparent p-0"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-9 shrink-0 gap-1.5 px-2.5 text-[9px]"
              >
                {tab.label}

                <span className="rounded bg-secondary px-1.5 py-0.5 text-[7px] tabular-nums text-muted-foreground">
                  {getTabCount(tab.value)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ProjectToolbar
            progressFilter={progressFilter}
            onProgressFilterChange={onProgressFilterChange}
            sort={sort}
            onSortChange={onSortChange}
          />
        </div>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            <ProjectsPanel
              tab={tab.value}
              search={search}
              progressFilter={progressFilter}
              sort={sort}
            />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}

/* =========================================================
   HEADER
========================================================= */

function ProjectsHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Projects
          </h2>

          <Badge
            variant="secondary"
            className="h-5 rounded-md px-1.5 text-[8px]"
          >
            {PROJECTS.length}
          </Badge>
        </div>

        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
          Manage projects, priorities and team progress.
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-[9px]"
      >
        <Plus className="size-3" />

        <span className="hidden min-[500px]:inline">New project</span>
      </Button>
    </div>
  );
}

/* =========================================================
   TOOLBAR
========================================================= */

interface ProjectToolbarProps {
  progressFilter: ProgressFilter;
  onProgressFilterChange: (value: ProgressFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

function ProjectToolbar({
  progressFilter,
  onProgressFilterChange,
  sort,
  onSortChange,
}: ProjectToolbarProps) {
  return (
    <div className="hidden shrink-0 items-center gap-1.5 pb-1.5 lg:flex">
      <ProgressFilterMenu
        value={progressFilter}
        onChange={onProgressFilterChange}
      />

      <SortMenu value={sort} onChange={onSortChange} />
    </div>
  );
}

/* =========================================================
   FILTER MENU
========================================================= */

const PROGRESS_FILTERS: readonly {
  value: ProgressFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All progress",
  },
  {
    value: "needs-attention",
    label: "Needs attention",
  },
  {
    value: "nearly-done",
    label: "Nearly done",
  },
];

function ProgressFilterMenu({
  value,
  onChange,
}: {
  value: ProgressFilter;
  onChange: (value: ProgressFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 gap-1.5 border-border bg-background px-2 text-[8px] font-medium text-muted-foreground shadow-none"
          />
        }
      >
        <Filter className="size-2.5" />
        Filter
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">Progress</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {PROGRESS_FILTERS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="text-xs"
          >
            <span className="flex-1">{option.label}</span>

            {value === option.value && (
              <Check className="size-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   SORT MENU
========================================================= */

const SORT_OPTIONS: readonly {
  value: SortOption;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: "default",
    label: "Default order",
    icon: ArrowUpDown,
  },
  {
    value: "name",
    label: "Name",
    icon: ArrowDownAZ,
  },
  {
    value: "progress-desc",
    label: "Progress: high to low",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "progress-asc",
    label: "Progress: low to high",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "due-date",
    label: "Due date",
    icon: CalendarDays,
  },
];

function SortMenu({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 gap-1.5 border-border bg-background px-2 text-[8px] font-medium text-muted-foreground shadow-none"
          />
        }
      >
        <ArrowUpDown className="size-2.5" />
        Sort
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Sort projects</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className="text-xs"
            >
              <Icon className="size-3.5" />

              <span className="flex-1">{option.label}</span>

              {value === option.value && (
                <Check className="size-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   TAB PANEL
========================================================= */

interface ProjectsPanelProps {
  tab: ProjectTab;
  search: string;
  progressFilter: ProgressFilter;
  sort: SortOption;
}

function ProjectsPanel({
  tab,
  search,
  progressFilter,
  sort,
}: ProjectsPanelProps) {
  const projects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = PROJECTS.filter((project) => {
      if (!matchesTab(project, tab)) {
        return false;
      }

      if (!matchesProgressFilter(project, progressFilter)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        project.key,
        project.name,
        project.status,
        ...project.team,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    return sortProjects(filtered, sort);
  }, [tab, search, progressFilter, sort]);

  if (projects.length === 0) {
    return (
      <ProjectsEmptyState
        hasSearch={search.trim().length > 0}
        hasFilter={progressFilter !== "all"}
      />
    );
  }

  return <ProjectsTable projects={projects} />;
}

/* =========================================================
   TABLE
========================================================= */

function ProjectsTable({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="overflow-hidden">
      <Table className="min-w-[540px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-9 pr-3 text-[8px] font-medium uppercase tracking-wide">
              Project
            </TableHead>

            <TableHead className="h-9 px-3 text-[8px] font-medium uppercase tracking-wide">
              Status
            </TableHead>

            <TableHead className="hidden h-9 px-3 text-[8px] font-medium uppercase tracking-wide md:table-cell">
              Team
            </TableHead>

            <TableHead className="h-9 px-3 text-[8px] font-medium uppercase tracking-wide">
              Progress
            </TableHead>

            <TableHead className="hidden h-9 pl-3 text-right text-[8px] font-medium uppercase tracking-wide md:table-cell">
              Due
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* =========================================================
   TABLE ROW
========================================================= */

function ProjectRow({ project }: { project: Project }) {
  return (
    <TableRow className="h-12 border-border/70 hover:bg-secondary/30">
      <TableCell className="pr-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <ProjectMark project={project} />

          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-foreground">
              {project.name}
            </p>

            <p className="mt-0.5 text-[8px] text-muted-foreground">
              {project.key}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-3">
        <ProjectStatusBadge status={project.status} />
      </TableCell>

      <TableCell className="hidden px-3 md:table-cell">
        <AvatarStack members={project.team} extra={project.extraMembers} />
      </TableCell>

      <TableCell className="px-3">
        <ProjectProgress value={project.progress} />
      </TableCell>

      <TableCell className="hidden pl-3 text-right text-[9px] tabular-nums text-muted-foreground md:table-cell">
        {formatDueDate(project.dueDate)}
      </TableCell>
    </TableRow>
  );
}

/* =========================================================
   PROJECT MARK
========================================================= */

function ProjectMark({ project }: { project: Project }) {
  return (
    <span
      className={`flex size-7 shrink-0 items-center justify-center rounded-md text-[8px] font-bold text-white ${project.markerClass}`}
    >
      {project.key}
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    containerClass: string;
    dotClass: string;
  }
> = {
  "In progress": {
    containerClass: "border-info/20 bg-info/10 text-info",
    dotClass: "bg-info",
  },

  "In review": {
    containerClass: "border-warning/20 bg-warning/10 text-warning",
    dotClass: "bg-warning",
  },

  Planned: {
    containerClass: "border-purple/20 bg-purple/10 text-purple",
    dotClass: "bg-purple",
  },

  Completed: {
    containerClass: "border-success/20 bg-success/10 text-success",
    dotClass: "bg-success",
  },
};

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      className={`h-5 gap-1.5 rounded-full px-2 text-[8px] font-medium ${config.containerClass}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${config.dotClass}`}
      />

      {status}
    </Badge>
  );
}

/* =========================================================
   TEAM
========================================================= */

function AvatarStack({
  members,
  extra = 0,
}: {
  members: readonly string[];
  extra?: number;
}) {
  return (
    <div
      className="flex -space-x-1.5"
      aria-label={`${members.length + extra} team members`}
    >
      {members.map((member) => (
        <Avatar key={member} className="size-6 border-2 border-card">
          <AvatarFallback className="bg-secondary text-[7px] font-semibold text-secondary-foreground">
            {member}
          </AvatarFallback>
        </Avatar>
      ))}

      {extra > 0 && (
        <Avatar className="size-6 border-2 border-card">
          <AvatarFallback className="bg-muted text-[7px] font-medium text-muted-foreground">
            +{extra}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function ProjectProgress({ value }: { value: number }) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex min-w-[96px] items-center gap-2">
      <Progress
        value={progress}
        aria-label={`${progress}% complete`}
        className="h-1.5 w-16"
      />

      <span className="w-7 text-right text-[8px] tabular-nums text-muted-foreground">
        {progress}%
      </span>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function ProjectsEmptyState({
  hasSearch,
  hasFilter,
}: {
  hasSearch: boolean;
  hasFilter: boolean;
}) {
  const filtered = hasSearch || hasFilter;

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary">
        <FolderKanban className="size-4 text-muted-foreground" />
      </div>

      <p className="mt-3 text-[10px] font-medium text-foreground">
        {filtered ? "No matching projects" : "No projects found"}
      </p>

      <p className="mt-1 max-w-[220px] text-[9px] leading-4 text-muted-foreground">
        {filtered
          ? "Try changing your search or progress filter."
          : "Projects available in this view will appear here."}
      </p>
    </div>
  );
}

/* =========================================================
   LOGO
========================================================= */

function DevFlowMark() {
  return (
    <svg
      viewBox="0 0 40 28"
      className="h-5 w-6 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M7 3h13l-4.2 7H11l-2 4h6.5l-6 11H1l5.2-10H3L7 3Z"
      />

      <path
        fill="currentColor"
        opacity="0.92"
        d="M23 3h14l-4 7h-5l-2.2 4H32l-6 11h-8l5.3-10H20l3-12Z"
      />
    </svg>
  );
}
