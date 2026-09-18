import {
  Bell,
  CalendarDays,
  CheckSquare2,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Folder,
  Inbox,
  ListFilter,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  { label: "Overview", icon: CheckSquare2 },
  { label: "Projects", icon: Folder, count: 8, active: true },
  { label: "My tasks", icon: CheckSquare2, count: 12 },
  { label: "Inbox", icon: Inbox, count: 4 },
  { label: "Team chat", icon: MessageSquare },
  { label: "Documents", icon: FileText },
  { label: "Calendar", icon: CalendarDays },
  { label: "Members", icon: Users },
];

const favorites = [
  { label: "DevFlow Web", className: "bg-info" },
  { label: "API Platform", className: "bg-primary" },
  { label: "Design System", className: "bg-success" },
];

const projects = [
  {
    initials: "DW",
    name: "DevFlow Web",
    status: "In progress",
    statusStyle: "bg-info/10 text-info",
    color: "bg-info",
    members: ["NM", "SK", "+2"],
    progress: 72,
    due: "Sep 24",
  },
  {
    initials: "AP",
    name: "API Platform",
    status: "In progress",
    statusStyle: "bg-info/10 text-info",
    color: "bg-primary",
    members: ["AH", "AR", "+1"],
    progress: 48,
    due: "Sep 28",
  },
  {
    initials: "DS",
    name: "Design System",
    status: "In review",
    statusStyle: "bg-warning/10 text-warning",
    color: "bg-success",
    members: ["SK", "AH", "+1"],
    progress: 91,
    due: "Sep 20",
  },
  {
    initials: "TC",
    name: "Team Chat",
    status: "In progress",
    statusStyle: "bg-info/10 text-info",
    color: "bg-primary",
    members: ["AR", "NM"],
    progress: 56,
    due: "Sep 30",
  },
  {
    initials: "NC",
    name: "Notification Center",
    status: "Planned",
    statusStyle: "bg-primary/10 text-primary",
    color: "bg-destructive",
    members: ["NM", "SK"],
    progress: 0,
    due: "Oct 02",
  },
  {
    initials: "WS",
    name: "Workspace Settings",
    status: "In progress",
    statusStyle: "bg-info/10 text-info",
    color: "bg-info",
    members: ["SK", "AH"],
    progress: 34,
    due: "Sep 27",
  },
];

export function WorkspacePreview() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-xl">
      <div className="grid grid-cols-[8.5rem_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-w-0">
          <Topbar />
          <Projects />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex min-h-[30rem] flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-10 items-center gap-2 border-b border-border px-3">
        <div className="flex size-5 items-center justify-center rounded  text-[9px] font-bold text-primary-foreground">
          <Image src={"/logo.png"} alt="logo" width={20} height={20} />
        </div>

        <span className="text-xs font-semibold text-sidebar-foreground">
          DevFlow
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2">
        {/* Workspace selector */}
        <div className="flex h-8 items-center justify-between rounded-md border border-sidebar-border bg-sidebar-accent px-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[10px] text-sidebar-foreground">
              DevFlow Studio
            </span>
          </div>

          <ChevronDown className="size-3 text-muted-foreground" />
        </div>

        <p className="mb-1 mt-3 px-1 text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>

        <nav className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={cn(
                  "flex h-6 items-center justify-between rounded px-1.5 text-[9px]",
                  item.active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="size-3 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count ? (
                  <span className="rounded bg-secondary px-1 text-[8px] text-secondary-foreground">
                    {item.count}
                  </span>
                ) : null}
              </div>
            );
          })}
        </nav>

        <p className="mb-1 mt-3 px-1 text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
          Favorites
        </p>

        <div className="space-y-0.5">
          {favorites.map((favorite) => (
            <div
              key={favorite.label}
              className="flex h-6 items-center gap-2 px-1.5 text-[9px] text-muted-foreground"
            >
              <span className={cn("size-2.5 rounded-sm", favorite.className)} />

              <span className="truncate">{favorite.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex h-10 items-center justify-end gap-3 border-b border-border px-3">
      <div className="flex h-7 w-48 items-center gap-2 rounded-md border border-border bg-secondary px-2">
        <Search className="size-3 text-muted-foreground" />

        <span className="flex-1 truncate text-[9px] text-muted-foreground">
          Search workspace...
        </span>

        <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[7px] text-muted-foreground">
          ⌘ K
        </kbd>
      </div>

      <div className="relative">
        <Bell className="size-3.5 text-muted-foreground" />
        <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex size-6 items-center justify-center rounded-full bg-secondary text-[8px] font-semibold text-secondary-foreground">
        NM
      </div>
    </header>
  );
}

function Projects() {
  return (
    <main className="p-3">
      {/* Heading */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Projects
          </h2>

          <p className="mt-0.5 text-[9px] text-muted-foreground">
            Manage your projects and track progress.
          </p>
        </div>

        <Button size="sm" className="h-7 px-2 text-[9px]">
          <Plus className="size-3" />
          New project
        </Button>
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-end justify-between gap-2 border-b border-border">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <Tab active>All projects</Tab>
          <Tab>In progress</Tab>
          <Tab>In review</Tab>
          <Tab>Completed</Tab>
        </div>

        <div className="mb-1.5 flex shrink-0 gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 px-2 text-[8px]"
          >
            <ListFilter className="size-2.5" />
            Filter
            <ChevronDown className="size-2.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 px-2 text-[8px]"
          >
            <ChevronsUpDown className="size-2.5" />
            Sort
            <ChevronDown className="size-2.5" />
          </Button>
        </div>
      </div>

      <ProjectTable />
    </main>
  );
}

function Tab({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative pb-2 text-[9px] text-muted-foreground",
        active && "font-medium text-foreground",
      )}
    >
      {children}

      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
      ) : null}
    </button>
  );
}

function ProjectTable() {
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[27%]" />
          <col className="w-[17%]" />
          <col className="w-[16%]" />
          <col className="w-[21%]" />
          <col className="w-[13%]" />
          <col className="w-[6%]" />
        </colgroup>

        <thead className="bg-card">
          <tr className="h-8 text-left text-[8px] font-normal text-muted-foreground">
            <th className="px-2 font-normal">Project</th>
            <th className="px-2 font-normal">Status</th>
            <th className="px-2 font-normal">Team</th>
            <th className="px-2 font-normal">Progress</th>
            <th className="px-2 font-normal">Due date</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.name} className="h-11 border-t border-border">
              <td className="px-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded text-[8px] font-semibold text-primary-foreground",
                      project.color,
                    )}
                  >
                    {project.initials}
                  </div>

                  <span className="truncate text-[9px] font-medium text-foreground">
                    {project.name}
                  </span>
                </div>
              </td>

              <td className="px-2">
                <span
                  className={cn(
                    "inline-flex max-w-full items-center gap-1 rounded-full px-1.5 py-1 text-[8px] font-medium",
                    project.statusStyle,
                  )}
                >
                  <span className="size-1 shrink-0 rounded-full bg-current" />

                  <span className="truncate">{project.status}</span>
                </span>
              </td>

              <td className="px-2">
                <div className="flex -space-x-1">
                  {project.members.map((member) => (
                    <span
                      key={member}
                      className="flex size-5 items-center justify-center rounded-full border border-background bg-secondary text-[7px] font-medium text-secondary-foreground"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-info"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <span className="w-6 shrink-0 text-right text-[8px] text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
              </td>

              <td className="whitespace-nowrap px-2 text-[8px] text-muted-foreground">
                {project.due}
              </td>

              <td>
                <MoreHorizontal className="size-3 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
