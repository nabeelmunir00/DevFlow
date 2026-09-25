import { cn } from "@/lib/utils";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        [
          "group/card flex flex-col",
          "rounded-lg border border-border",
          "bg-card text-card-foreground",
          "[--card-spacing:--spacing(5)]",
          "data-[size=sm]:[--card-spacing:--spacing(4)]",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          "grid auto-rows-min items-start gap-1",
          "px-(--card-spacing) pt-(--card-spacing)",
          "has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]",
          "has-data-[slot=card-description]:grid-rows-[auto_auto]",
          "[.border-b]:pb-(--card-spacing)",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        [
          "font-heading",
          "text-sm font-semibold leading-5",
          "text-card-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        [
          "col-start-2 row-span-2 row-start-1",
          "self-start justify-self-end",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing) py-(--card-spacing)", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          "flex items-center",
          "px-(--card-spacing) pb-(--card-spacing)",
          "[.border-t]:pt-(--card-spacing)",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
