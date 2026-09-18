import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-md border border-transparent",
    "text-sm font-medium whitespace-nowrap",
    "transition-colors outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",

        outline:
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",

        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        xs: "h-7 gap-1 px-2 text-xs",

        sm: "h-8 gap-1.5 px-2.5 text-sm",

        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-start]:pl-2.5 has-data-[icon=inline-end]:pr-2.5",

        lg: "h-10 gap-2 px-4",

        icon: "size-9",

        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",

        "icon-sm": "size-8",

        "icon-lg": "size-10",
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
