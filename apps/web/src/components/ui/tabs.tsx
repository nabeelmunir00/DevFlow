"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-3 data-horizontal:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "group/tabs-list inline-flex w-fit items-center",
    "text-muted-foreground",
    "group-data-vertical/tabs:flex-col",
    "group-data-vertical/tabs:items-stretch",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "h-9 rounded-md bg-muted p-1",

        line: "gap-4 border-b border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        [
          "relative inline-flex h-7 items-center justify-center gap-1.5",
          "rounded-sm border border-transparent px-2.5",
          "text-sm font-medium whitespace-nowrap text-muted-foreground",
          "transition-colors outline-none",
          "hover:text-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-active:bg-background data-active:text-foreground",
          "group-data-[variant=line]/tabs-list:h-9",
          "group-data-[variant=line]/tabs-list:rounded-none",
          "group-data-[variant=line]/tabs-list:px-0",
          "group-data-[variant=line]/tabs-list:data-active:bg-transparent",
          "group-data-[variant=line]/tabs-list:data-active:text-foreground",
          "group-data-[variant=line]/tabs-list:after:absolute",
          "group-data-[variant=line]/tabs-list:after:inset-x-0",
          "group-data-[variant=line]/tabs-list:after:-bottom-px",
          "group-data-[variant=line]/tabs-list:after:h-0.5",
          "group-data-[variant=line]/tabs-list:after:bg-primary",
          "group-data-[variant=line]/tabs-list:after:opacity-0",
          "group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
