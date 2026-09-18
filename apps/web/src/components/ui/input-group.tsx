"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        [
          "group/input-group relative flex h-9 w-full min-w-0 items-center",
          "rounded-md border border-input bg-background",
          "transition-colors outline-none",
          "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30",
          "has-[[data-slot][aria-invalid=true]]:border-destructive",
          "has-[[data-slot][aria-invalid=true]]:ring-[3px]",
          "has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
          "has-[>textarea]:h-auto",
          "has-[>[data-align=block-start]]:h-auto",
          "has-[>[data-align=block-start]]:flex-col",
          "has-[>[data-align=block-end]]:h-auto",
          "has-[>[data-align=block-end]]:flex-col",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto cursor-text items-center justify-center",
    "gap-2 py-2 text-sm text-muted-foreground",
    "select-none",
    "group-data-[disabled=true]/input-group:opacity-50",
    "[&>svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:-ml-1",

        "inline-end": "order-last pr-3 has-[>button]:-mr-1",

        "block-start":
          "order-first w-full justify-start border-b border-border px-3 py-2",

        "block-end":
          "order-last w-full justify-start border-t border-border px-3 py-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) {
          return;
        }

        event.currentTarget.parentElement
          ?.querySelector<
            HTMLInputElement | HTMLTextAreaElement
          >('[data-slot="input-group-control"]')
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-1.5 rounded-sm text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-7 px-2",
        "icon-xs": "size-6 p-0",
        "icon-sm": "size-7 p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        [
          "flex items-center gap-2",
          "text-sm text-muted-foreground",
          "[&_svg]:pointer-events-none",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        [
          "flex-1 rounded-none border-0 bg-transparent",
          "shadow-none ring-0",
          "focus-visible:border-transparent focus-visible:ring-0",
          "aria-invalid:border-transparent aria-invalid:ring-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        [
          "flex-1 resize-y rounded-none border-0 bg-transparent",
          "shadow-none ring-0",
          "focus-visible:border-transparent focus-visible:ring-0",
          "aria-invalid:border-transparent aria-invalid:ring-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
