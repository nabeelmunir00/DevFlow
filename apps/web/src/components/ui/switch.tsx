"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        [
          "peer group/switch relative inline-flex shrink-0 items-center",
          "rounded-full border border-transparent",
          "outline-none",

          "transition-[background-color,border-color,box-shadow,opacity]",
          "duration-150 ease-out",

          "data-[size=default]:h-5",
          "data-[size=default]:w-9",
          "data-[size=sm]:h-4",
          "data-[size=sm]:w-7",

          "data-checked:bg-primary",
          "data-unchecked:bg-input",

          "hover:data-unchecked:bg-foreground/20",
          "hover:data-checked:bg-primary/90",

          "focus-visible:border-ring",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",

          "data-disabled:pointer-events-none",
          "data-disabled:cursor-not-allowed",
          "data-disabled:opacity-50",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-2",
          "aria-invalid:ring-destructive/20",
          "aria-invalid:ring-offset-2",
          "aria-invalid:ring-offset-background",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          [
            "pointer-events-none block rounded-full",
            "bg-background",
            "ring-1 ring-black/5",

            "transition-transform",
            "duration-150 ease-out",

            "group-data-[size=default]/switch:size-4",
            "group-data-[size=sm]/switch:size-3",

            "group-data-[size=default]/switch:data-unchecked:translate-x-0.5",
            "group-data-[size=default]/switch:data-checked:translate-x-[18px]",

            "group-data-[size=sm]/switch:data-unchecked:translate-x-0.5",
            "group-data-[size=sm]/switch:data-checked:translate-x-[14px]",
          ].join(" "),
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
