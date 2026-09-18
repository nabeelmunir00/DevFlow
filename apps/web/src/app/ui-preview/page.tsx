import {
  BellIcon,
  CheckIcon,
  Code2Icon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UiPreviewPage() {
  return (
    <TooltipProvider>
      <main className="min-h-dvh bg-background">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline">Internal preview</Badge>

              <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
                DevFlow UI Foundation
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Visual QA for typography, controls, surfaces, states, and
                information density before production screens are built.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={<Button variant="outline" size="icon" />}
                >
                  <BellIcon />
                </TooltipTrigger>

                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <Button>
                <PlusIcon data-icon="inline-start" />
                New project
              </Button>
            </div>
          </header>

          <section className="grid gap-8 py-8">
            <PreviewSection
              title="Typography"
              description="Core hierarchy for workspace interfaces."
            >
              <div className="grid gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Page heading
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
                    Engineering workspace
                  </h2>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    Sprint planning
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Plan work, assign owners, and track progress without
                    unnecessary visual noise.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="text-sm font-medium">Primary text</span>
                  <span className="text-sm text-muted-foreground">
                    Secondary text
                  </span>
                  <code className="font-mono text-xs">DEV-184</code>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </div>
              </div>
            </PreviewSection>

            <PreviewSection
              title="Actions"
              description="Primary, secondary, destructive, and compact controls."
            >
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="link">View details</Button>

                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="outline" size="icon" />}
                  >
                    <SettingsIcon />
                  </TooltipTrigger>
                  <TooltipContent>Project settings</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline" size="icon" />}
                  >
                    <MoreHorizontalIcon />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Project actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      Open settings
                      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Code2Icon />
                      Open repository
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </PreviewSection>

            <PreviewSection
              title="Status & people"
              description="Metadata patterns used across projects, tasks, and teams."
            >
              <div className="grid gap-6">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Backlog</Badge>
                  <Badge variant="info">In progress</Badge>
                  <Badge variant="success">Completed</Badge>
                  <Badge variant="warning">Medium</Badge>
                  <Badge variant="destructive">Urgent</Badge>
                  <Badge variant="outline">GitHub</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <AvatarGroup>
                    <Avatar>
                      <AvatarFallback>NM</AvatarFallback>
                      <AvatarBadge className="bg-success" />
                    </Avatar>

                    <Avatar>
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>

                    <Avatar>
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>

                    <AvatarGroupCount>+4</AvatarGroupCount>
                  </AvatarGroup>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckIcon className="size-4 text-success" />7 members
                    active
                  </div>
                </div>
              </div>
            </PreviewSection>

            <PreviewSection
              title="Form controls"
              description="Default, selected, and descriptive form patterns."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project name</Label>
                  <Input id="project-name" placeholder="e.g. DevFlow Web" />
                  <p className="text-xs text-muted-foreground">
                    A concise name visible to your workspace.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Project status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 lg:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project..."
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Search</Label>

                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search issues..." />
                  </InputGroup>
                </div>

                <div className="flex flex-col justify-end gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox defaultChecked />
                    Include completed issues
                  </label>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label>GitHub sync</Label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Automatically synchronize repository activity.
                      </p>
                    </div>

                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </PreviewSection>

            <PreviewSection
              title="Tabs & surfaces"
              description="Compact navigation and grouped content."
            >
              <Tabs defaultValue="overview">
                <TabsList variant="line">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sprint progress</CardTitle>
                        <CardDescription>
                          Current sprint completion.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-end justify-between">
                          <strong className="text-2xl font-semibold">
                            68%
                          </strong>
                          <Badge variant="success">+12%</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card size="sm">
                      <CardHeader>
                        <CardTitle>Repository</CardTitle>
                        <CardDescription>
                          GitHub integration status.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-2 text-sm">
                          <Code2Icon className="size-4" />
                          devflow/web
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="pt-5">
                  <p className="text-sm text-muted-foreground">
                    Activity preview.
                  </p>
                </TabsContent>

                <TabsContent value="settings" className="pt-5">
                  <p className="text-sm text-muted-foreground">
                    Settings preview.
                  </p>
                </TabsContent>
              </Tabs>
            </PreviewSection>

            <PreviewSection
              title="Data table"
              description="Dense project-management information layout."
            >
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <IssueRow
                      issue="DEV-184"
                      title="Workspace navigation"
                      status="In progress"
                      statusVariant="info"
                      priority="High"
                      initials="NM"
                    />

                    <IssueRow
                      issue="DEV-173"
                      title="GitHub webhook sync"
                      status="Completed"
                      statusVariant="success"
                      priority="Medium"
                      initials="AK"
                    />

                    <IssueRow
                      issue="DEV-191"
                      title="Project permissions"
                      status="Backlog"
                      statusVariant="secondary"
                      priority="Urgent"
                      initials="SA"
                    />
                  </TableBody>
                </Table>
              </div>
            </PreviewSection>

            <PreviewSection
              title="Loading states"
              description="Structural placeholders for asynchronous content."
            >
              <div className="grid max-w-xl gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />

                  <div className="grid flex-1 gap-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-64 max-w-full" />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-8 w-3/5" />
                </div>
              </div>
            </PreviewSection>
          </section>
        </div>
      </main>
    </TooltipProvider>
  );
}

function PreviewSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-b border-border pb-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="min-w-0">{children}</div>
    </section>
  );
}

type StatusVariant = "info" | "success" | "secondary";

function IssueRow({
  issue,
  title,
  status,
  statusVariant,
  priority,
  initials,
}: {
  issue: string;
  title: string;
  status: string;
  statusVariant: StatusVariant;
  priority: string;
  initials: string;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {issue}
          </span>
          <span className="font-medium">{title}</span>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={statusVariant}>{status}</Badge>
      </TableCell>

      <TableCell className="text-muted-foreground">{priority}</TableCell>

      <TableCell>
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </TableCell>
    </TableRow>
  );
}
