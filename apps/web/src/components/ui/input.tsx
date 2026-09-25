import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        [
          "h-9 w-full min-w-0 rounded-md border border-input",
          "bg-background px-3",
          "text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "outline-none",
          "transition-[color,background-color,border-color,box-shadow]",
          "duration-150 ease-out",

          "hover:border-foreground/20",

          "focus-visible:border-ring",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

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

          "file:inline-flex",
          "file:h-7",
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          "file:text-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
