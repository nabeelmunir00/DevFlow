import {
  Bell,
  GitBranch,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectSettingsSection } from "./project-settings";

interface SettingsSidebarProps {
  activeSection: ProjectSettingsSection;
  onSectionChange: (section: ProjectSettingsSection) => void;
}

const settingsItems: {
  value: ProjectSettingsSection;
  label: string;
  icon: typeof Settings2;
}[] = [
  {
    value: "general",
    label: "General",
    icon: Settings2,
  },
  {
    value: "members",
    label: "Members & access",
    icon: Users,
  },
  {
    value: "workflow",
    label: "Task workflow",
    icon: SlidersHorizontal,
  },
  {
    value: "repository",
    label: "Repository",
    icon: GitBranch,
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    value: "danger",
    label: "Danger zone",
    icon: ShieldAlert,
  },
];

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <aside className="shrink-0 border-b border-border md:w-56 md:border-r md:border-b-0">
      <div className="p-4">
        <p className="mb-3 px-2 text-xs font-medium text-muted-foreground">
          Project settings
        </p>

        <nav
          aria-label="Project settings"
          className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
        >
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.value;
            const isDanger = item.value === "danger";

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onSectionChange(item.value)}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive &&
                    !isDanger &&
                    "bg-secondary font-medium text-foreground",
                  !isActive &&
                    !isDanger &&
                    "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isDanger &&
                    !isActive &&
                    "text-destructive hover:bg-destructive/10",
                  isDanger &&
                    isActive &&
                    "bg-destructive/10 font-medium text-destructive",
                )}
              >
                <Icon className="size-4 shrink-0" />

                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
