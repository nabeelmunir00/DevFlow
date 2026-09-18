import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        [
          "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center",
          "gap-1 rounded-sm border border-border bg-muted px-1",
          "font-mono text-[11px] font-medium leading-none text-muted-foreground",
          "select-none",
          "in-data-[slot=tooltip-content]:border-background/20",
          "in-data-[slot=tooltip-content]:bg-background/10",
          "in-data-[slot=tooltip-content]:text-background",
          "[&_svg:not([class*='size-'])]:size-3",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
