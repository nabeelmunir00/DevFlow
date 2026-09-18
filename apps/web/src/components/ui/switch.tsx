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
          "transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "data-[size=default]:h-5 data-[size=default]:w-9",
          "data-[size=sm]:h-4 data-[size=sm]:w-7",
          "data-checked:bg-primary",
          "data-unchecked:bg-input",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          [
            "pointer-events-none block rounded-full bg-background",
            "shadow-xs transition-transform",
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
