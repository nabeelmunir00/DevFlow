import {
  ArrowRight,
  AtSign,
  Check,
  FileText,
  Hash,
  MessageSquare,
  Paperclip,
  Send,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const benefits = [
  "Keep project conversations close to the work",
  "Share files, updates, and decisions with your team",
  "Bring tasks and discussions into one shared context",
];

export function TeamCollaboration() {
  return (
    <section className="border-y border-border bg-muted/20 py-24 sm:py-28">
      <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:px-12 xl:gap-20">
        <CollaborationPreview />

        <div className="max-w-xl lg:justify-self-end">
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 text-primary"
          >
            <Users className="size-3.5" />
            Team collaboration
          </Badge>

          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Keep your team
            <br />
            in the same context
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Discuss work where it happens. DevFlow keeps conversations, project
            updates, files, and decisions connected to your team&apos;s
            workflow.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3.5 text-primary" />
                </div>

                <p className="text-sm text-foreground">{benefit}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" size="lg" className="mt-9">
            Explore collaboration
            <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

function CollaborationPreview() {
  return (
    <Card className="overflow-hidden border-border/80 bg-card py-0 shadow-xl shadow-black/10">
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
            <Hash className="size-4 text-foreground" />
          </div>

          <div>
            <CardTitle className="text-sm">devflow-web</CardTitle>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Project channel
            </p>
          </div>
        </div>

        <div className="flex items-center -space-x-2">
          <Member initials="NM" />
          <Member initials="SK" />
          <Member initials="AH" />

          <div className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs text-muted-foreground">
            +3
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {/* Context */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">DEV-142</Badge>

            <span className="text-xs text-muted-foreground">
              Project dashboard performance
            </span>
          </div>

          <Badge variant="secondary" className="font-normal">
            6 members
          </Badge>
        </div>

        <Separator />

        {/* Messages */}
        <div className="space-y-6 px-5 py-5">
          <Message initials="SK" name="Sarah Khan" time="10:24 AM">
            Dashboard API changes are ready. The average response time is down
            significantly after the query update.
          </Message>

          <div className="ml-11 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  performance-report.md
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  12 KB · Markdown
                </p>
              </div>

              <Badge variant="outline" className="hidden font-normal sm:flex">
                Project file
              </Badge>
            </div>
          </div>

          <Message initials="AH" name="Ali Hassan" time="10:31 AM">
            Nice. I&apos;ve linked the frontend changes to DEV-142. We can move
            this into review after the final check.
          </Message>

          <div className="ml-11 flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 font-normal text-success"
            >
              <Check className="size-3" />
              DEV-142 linked
            </Badge>

            <Badge variant="secondary" className="font-normal">
              PR #128
            </Badge>
          </div>

          <Message initials="NM" name="Nabeel" time="10:34 AM">
            Perfect. I&apos;ll review the PR and update the sprint once the
            checks pass.
          </Message>
        </div>

        <Separator />

        {/* Composer */}
        <div className="bg-muted/20 p-4">
          <div className="rounded-lg border border-border bg-background p-2">
            <Input
              readOnly
              placeholder="Message #devflow-web"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />

            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Attach file"
                >
                  <Paperclip className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Mention member"
                >
                  <AtSign className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Open conversations"
                >
                  <MessageSquare className="size-4" />
                </Button>
              </div>

              <Button size="icon" className="size-8" aria-label="Send message">
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageProps {
  initials: string;
  name: string;
  time: string;
  children: React.ReactNode;
}

function Message({ initials, name, time, children }: MessageProps) {
  return (
    <div className="flex items-start gap-3">
      <Member initials={initials} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{name}</p>

          <span className="text-xs text-muted-foreground">{time}</span>
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

function Member({ initials }: { initials: string }) {
  return (
    <Avatar className="size-8 border-2 border-card">
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}
