"use client";

import { useState } from "react";

import { DangerZoneSettings } from "./danger/danger-zone-settings";
import { GeneralSettings } from "./general/general-settings";
import { MembersSettings } from "./members/members-settings";
import { NotificationSettings } from "./notifications/notification-settings";
import { RepositorySettings } from "./repository/repository-settings";
import { SettingsSidebar } from "./settings-sidebar";
import { WorkflowSettings } from "./workflow/workflow-settings";

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

        {activeSection === "members" && <MembersSettings />}

        {activeSection === "workflow" && <WorkflowSettings />}

        {activeSection === "repository" && <RepositorySettings />}

        {activeSection === "notifications" && <NotificationSettings />}

        {activeSection === "danger" && <DangerZoneSettings />}
      </div>
    </div>
  );
}
