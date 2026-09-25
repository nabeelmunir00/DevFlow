import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "group/badge inline-flex h-5 w-fit shrink-0",
    "items-center justify-center gap-1",
    "overflow-hidden rounded-md",
    "border border-transparent",
    "px-2",
    "text-xs font-medium leading-none whitespace-nowrap",
    "outline-none",
    "transition-[color,background-color,border-color]",
    "duration-150 ease-out",

    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",

    "aria-invalid:border-destructive",
    "aria-invalid:ring-2",
    "aria-invalid:ring-destructive/20",

    "has-data-[icon=inline-start]:pl-1.5",
    "has-data-[icon=inline-end]:pr-1.5",

    "[&>svg]:pointer-events-none",
    "[&>svg]:size-3",
    "[&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "[a]:hover:bg-primary/90",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "[a]:hover:bg-hover",
        ].join(" "),

        outline: [
          "border-border",
          "bg-transparent text-foreground",
          "[a]:hover:bg-hover",
        ].join(" "),

        destructive: [
          "bg-destructive/10 text-destructive",
          "[a]:hover:bg-destructive/15",
        ].join(" "),

        success: ["bg-primary/10 text-primary", "[a]:hover:bg-primary/15"].join(
          " ",
        ),

        warning: ["bg-warning/10 text-warning", "[a]:hover:bg-warning/15"].join(
          " ",
        ),

        info: ["bg-primary/10 text-primary", "[a]:hover:bg-primary/15"].join(
          " ",
        ),

        ghost: [
          "text-muted-foreground",
          "[a]:hover:bg-hover",
          "[a]:hover:text-foreground",
        ].join(" "),

        link: [
          "text-primary",
          "underline-offset-4",
          "[a]:hover:underline",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
