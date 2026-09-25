import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "field-sizing-content min-h-24 w-full resize-y",
          "rounded-md border border-input",
          "bg-background px-3 py-2",
          "text-sm leading-5 text-foreground",
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
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
