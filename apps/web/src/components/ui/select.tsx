"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex min-w-0 flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          "flex w-fit min-w-0 items-center justify-between gap-2",
          "rounded-md border border-input",
          "bg-background px-3",
          "text-sm font-normal whitespace-nowrap text-foreground",
          "outline-none",
          "transition-[color,background-color,border-color,box-shadow]",
          "duration-150 ease-out",

          "data-[size=default]:h-9",
          "data-[size=sm]:h-8",

          "data-placeholder:text-muted-foreground",

          "hover:border-foreground/20",

          "focus-visible:border-ring",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",

          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:bg-muted",
          "disabled:text-muted-foreground",
          "disabled:opacity-60",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-2",
          "aria-invalid:ring-destructive/20",
          "aria-invalid:ring-offset-2",
          "aria-invalid:ring-offset-background",

          "*:data-[slot=select-value]:line-clamp-1",

          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            className="size-4 text-muted-foreground"
            strokeWidth={1.75}
          />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            [
              "relative isolate z-50",
              "max-h-(--available-height)",
              "w-(--anchor-width) min-w-36",
              "origin-(--transform-origin)",
              "overflow-x-hidden overflow-y-auto",

              "rounded-md border border-border",
              "bg-popover p-1",
              "text-popover-foreground",

              "shadow-lg outline-none",

              "duration-150 ease-out",

              "data-open:animate-in",
              "data-open:fade-in-0",
              "data-open:zoom-in-95",

              "data-closed:animate-out",
              "data-closed:fade-out-0",
              "data-closed:zoom-out-95",
            ].join(" "),
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List>{children}</SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        [
          "px-2 py-1.5",
          "text-xs font-medium leading-4",
          "text-muted-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        [
          "relative flex min-h-8 w-full",
          "cursor-default items-center gap-2",
          "rounded-md py-1.5 pr-8 pl-2",

          "text-sm leading-5 text-popover-foreground",

          "outline-none select-none",

          "transition-colors duration-150 ease-out",

          "focus:bg-hover",
          "focus:text-foreground",

          "data-selected:bg-accent",
          "data-selected:text-accent-foreground",

          "data-disabled:pointer-events-none",
          "data-disabled:text-muted-foreground",
          "data-disabled:opacity-50",

          "[&_svg]:pointer-events-none",
          "[&_svg]:size-4",
          "[&_svg]:shrink-0",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator
        render={
          <span
            className={[
              "pointer-events-none",
              "absolute right-2",
              "flex size-4 items-center justify-center",
              "text-primary",
            ].join(" ")}
          />
        }
      >
        <CheckIcon className="size-4" strokeWidth={1.75} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        [
          "sticky top-0 z-10",
          "flex h-7 w-full items-center justify-center",
          "bg-popover text-muted-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" strokeWidth={1.75} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        [
          "sticky bottom-0 z-10",
          "flex h-7 w-full items-center justify-center",
          "bg-popover text-muted-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" strokeWidth={1.75} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
