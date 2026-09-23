"use client";

import { useState } from "react";

import { GeneralSettings } from "./general/general-settings";
import { SettingsSidebar } from "./settings-sidebar";

export type ProjectSettingsSection =
  | "general"
  | "members"
  | "workflow"
  | "repository"
  | "notifications"
  | "danger";

export function ProjectSettings() {
  const [activeSection, setActiveSection] =
    useState<ProjectSettingsSection>("general");

  return (
    <div className="flex min-w-0 flex-1 flex-col md:flex-row">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="min-w-0 flex-1">
        {activeSection === "general" && <GeneralSettings />}

        {activeSection !== "general" && (
          <div className="flex min-h-80 items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">
              This settings section will be added next.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
