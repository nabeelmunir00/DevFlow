import { CalendarDays, ChevronDown, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActivityToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ActivityToolbar({
  search,
  onSearchChange,
}: ActivityToolbarProps) {
  return (
    <div className="grid gap-3 xl:grid-cols-12">
      <div className="relative xl:col-span-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search activity..."
          className="pl-9"
        />
      </div>

      <Button variant="outline" className="justify-between xl:col-span-2">
        Member
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button variant="outline" className="justify-between xl:col-span-2">
        Event type
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button variant="outline" className="justify-between xl:col-span-2">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          Last 7 days
        </span>

        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      <Button variant="outline" className="xl:col-span-2">
        <Download className="size-4" />
        Export
      </Button>
    </div>
  );
}
