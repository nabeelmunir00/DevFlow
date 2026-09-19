export interface WorkspaceNavigationItem {
  label: string;
  href: string;
  icon: string;
}

export const workspaceNavigation: WorkspaceNavigationItem[] = [
  {
    label: "Home",
    href: "",
    icon: "solar:home-2-linear",
  },
  {
    label: "My Work",
    href: "my-work",
    icon: "solar:case-minimalistic-linear",
  },
  {
    label: "Projects",
    href: "projects",
    icon: "solar:folder-with-files-linear",
  },
  {
    label: "Tasks",
    href: "tasks",
    icon: "solar:checklist-minimalistic-linear",
  },
  {
    label: "Sprints",
    href: "sprints",
    icon: "solar:flag-linear",
  },
  {
    label: "Teams",
    href: "teams",
    icon: "solar:users-group-rounded-linear",
  },
  {
    label: "GitHub",
    href: "github",
    icon: "mdi:github",
  },
  {
    label: "AI Assistant",
    href: "ai",
    icon: "solar:magic-stick-3-linear",
  },
  {
    label: "Analytics",
    href: "analytics",
    icon: "solar:chart-2-linear",
  },
];

export const workspaceSecondaryNavigation: WorkspaceNavigationItem[] = [
  {
    label: "Activity",
    href: "activity",
    icon: "solar:pulse-2-linear",
  },
  {
    label: "Notifications",
    href: "notifications",
    icon: "solar:bell-linear",
  },
  {
    label: "Settings",
    href: "settings",
    icon: "solar:settings-linear",
  },
];
