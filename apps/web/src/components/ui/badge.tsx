import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center",
    "gap-1 overflow-hidden rounded-md border border-transparent",
    "px-2 text-xs font-medium leading-none whitespace-nowrap",
    "transition-colors outline-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "has-data-[icon=inline-start]:pl-1.5",
    "has-data-[icon=inline-end]:pr-1.5",
    "[&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/90",

        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-accent",

        outline:
          "border-border bg-background text-foreground [a]:hover:bg-accent",

        destructive:
          "bg-destructive/10 text-destructive [a]:hover:bg-destructive/15",

        success: "bg-success/15 text-success [a]:hover:bg-success/20",

        warning: "bg-warning/15 text-warning [a]:hover:bg-warning/20",

        info: "bg-info/15 text-info [a]:hover:bg-info/20",

        ghost:
          "text-muted-foreground [a]:hover:bg-accent [a]:hover:text-foreground",

        link: "text-primary underline-offset-4 [a]:hover:underline",
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
