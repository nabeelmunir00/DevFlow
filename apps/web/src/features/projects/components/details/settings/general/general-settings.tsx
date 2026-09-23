"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CalendarDays, ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSettingsForm {
  logo: File | null;
  name: string;
  key: string;
  description: string;
  status: string;
  lead: string;
  team: string;
  startDate: string;
  dueDate: string;
  visibility: string;
  defaultAssignee: string;
  defaultPriority: string;
}

interface DatePickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const initialForm: GeneralSettingsForm = {
  logo: null,
  name: "DevFlow Web",
  key: "DF",
  description: "Web application for teams",
  status: "IN_PROGRESS",
  lead: "Nabeel Munir",
  team: "Engineering",
  startDate: "2026-08-18",
  dueDate: "2026-09-25",
  visibility: "PRIVATE",
  defaultAssignee: "UNASSIGNED",
  defaultPriority: "MEDIUM",
};

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

function parseDate(value: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Select date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DatePickerField({ id, value, onChange }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className="w-full justify-start font-normal"
          />
        }
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {formatDisplayDate(value)}
        </span>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            if (!date) return;

            onChange(formatDateValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function GeneralSettings() {
  const [form, setForm] = useState<GeneralSettingsForm>(initialForm);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [logoError, setLogoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  function updateField<K extends keyof GeneralSettingsForm>(
    field: K,
    value: GeneralSettingsForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSelectField<K extends keyof GeneralSettingsForm>(
    field: K,
    value: string | null,
  ) {
    if (value === null) return;

    updateField(field, value as GeneralSettingsForm[K]);
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Please select a PNG, JPG, WebP or SVG image.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError("Image must be smaller than 2 MB.");

      event.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
    setLogoError(null);

    updateField("logo", file);
  }

  function handleRemoveLogo() {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);
    setLogoError(null);

    updateField("logo", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleCancel() {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);
    setLogoError(null);
    setForm(initialForm);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSave() {
    // API integration later:
    //
    // 1. Upload form.logo if a new logo was selected.
    // 2. Receive the uploaded logo URL.
    // 3. Update project settings.
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6 sm:px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">General</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your project details and default configuration.
        </p>
      </div>

      {/* Project details */}
      <section className="mt-8">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Project details
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information used to identify this project.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          {/* Project icon */}
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
            <Label className="pt-2">Project icon</Label>

            <div>
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-primary">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={`${form.name} project icon`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-primary-foreground">
                      {form.key || "DF"}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="size-4" />

                    {logoPreview ? "Change icon" : "Upload icon"}
                  </Button>

                  {logoPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                PNG, JPG, WebP or SVG. Maximum 2 MB.
              </p>

              {logoError && (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                  {logoError}
                </p>
              )}
            </div>
          </div>

          {/* Project name */}
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
            <Label htmlFor="project-name" className="pt-2">
              Project name
            </Label>

            <Input
              id="project-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          {/* Project key */}
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
            <div className="pt-2">
              <Label htmlFor="project-key">Project key</Label>

              <p className="mt-1 text-xs text-muted-foreground">
                Used in task IDs.
              </p>
            </div>

            <Input
              id="project-key"
              value={form.key}
              onChange={(event) =>
                updateField("key", event.target.value.toUpperCase())
              }
              className="max-w-48"
            />
          </div>

          {/* Description */}
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
            <Label htmlFor="project-description" className="pt-2">
              Description
            </Label>

            <Textarea
              id="project-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </section>

      {/* Project configuration */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Project configuration
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure ownership, dates and project visibility.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={form.status}
              onValueChange={(value) => updateSelectField("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>

                <SelectItem value="IN_REVIEW">In review</SelectItem>

                <SelectItem value="ON_TRACK">On track</SelectItem>

                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project lead */}
          <div className="space-y-2">
            <Label>Project lead</Label>

            <Select
              value={form.lead}
              onValueChange={(value) => updateSelectField("lead", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Nabeel Munir">Nabeel Munir</SelectItem>

                <SelectItem value="Sara Ali">Sara Ali</SelectItem>

                <SelectItem value="Ahmed Hassan">Ahmed Hassan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label>Team</Label>

            <Select
              value={form.team}
              onValueChange={(value) => updateSelectField("team", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>

                <SelectItem value="Design">Design</SelectItem>

                <SelectItem value="Product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>

            <Select
              value={form.visibility}
              onValueChange={(value) => updateSelectField("visibility", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PRIVATE">Private</SelectItem>

                <SelectItem value="ORGANIZATION">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start date</Label>

            <DatePickerField
              id="start-date"
              value={form.startDate}
              onChange={(value) => updateField("startDate", value)}
            />
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due date</Label>

            <DatePickerField
              id="due-date"
              value={form.dueDate}
              onChange={(value) => updateField("dueDate", value)}
            />
          </div>
        </div>
      </section>

      {/* Defaults */}
      <section className="mt-9">
        <div className="border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-foreground">Defaults</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Default values applied when creating new tasks.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* Default assignee */}
          <div className="space-y-2">
            <Label>Default assignee</Label>

            <Select
              value={form.defaultAssignee}
              onValueChange={(value) =>
                updateSelectField("defaultAssignee", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="UNASSIGNED">Unassigned</SelectItem>

                <SelectItem value="Nabeel Munir">Nabeel Munir</SelectItem>

                <SelectItem value="Sara Ali">Sara Ali</SelectItem>

                <SelectItem value="Ahmed Hassan">Ahmed Hassan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default priority */}
          <div className="space-y-2">
            <Label>Default priority</Label>

            <Select
              value={form.defaultPriority}
              onValueChange={(value) =>
                updateSelectField("defaultPriority", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>

                <SelectItem value="MEDIUM">Medium</SelectItem>

                <SelectItem value="HIGH">High</SelectItem>

                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-9 flex items-center justify-end gap-2 border-t border-border pt-5">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>

        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
