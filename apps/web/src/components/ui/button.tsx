import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-md border border-transparent",
    "text-sm font-medium whitespace-nowrap",
    "outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,opacity]",
    "duration-150 ease-out",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-2 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "active:bg-primary/85",
        ].join(" "),

        secondary: [
          "border-border bg-card text-foreground",
          "hover:bg-hover",
          "active:bg-accent",
        ].join(" "),

        outline: [
          "border-border bg-transparent text-foreground",
          "hover:bg-hover",
          "active:bg-accent",
        ].join(" "),

        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-hover",
          "active:bg-accent",
        ].join(" "),

        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "active:bg-destructive/85",
        ].join(" "),

        link: [
          "h-auto rounded-none border-0 bg-transparent p-0",
          "text-primary underline-offset-4",
          "hover:underline",
        ].join(" "),
      },

      size: {
        xs: ["h-7 gap-1 px-2", "text-xs"].join(" "),

        sm: ["h-8 gap-1.5 px-3", "text-xs"].join(" "),

        default: [
          "h-9 gap-1.5 px-3",
          "has-data-[icon=inline-start]:pl-2.5",
          "has-data-[icon=inline-end]:pr-2.5",
        ].join(" "),

        lg: ["h-11 gap-2 px-4", "text-sm"].join(" "),

        icon: "size-9",

        "icon-xs": ["size-7", "[&_svg:not([class*='size-'])]:size-3.5"].join(
          " ",
        ),

        "icon-sm": "size-8",

        "icon-lg": "size-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
