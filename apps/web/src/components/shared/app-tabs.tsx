"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface AppTab<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface AppTabsProps<T extends string> {
  tabs: readonly AppTab<T>[];
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel?: string;
}

export function AppTabs<T extends string>({
  tabs,
  value,
  onValueChange,
  ariaLabel = "Page navigation",
}: AppTabsProps<T>) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as T)}
      className="min-w-0 px-4 py-4 sm:px-6 2xl:px-7 "
    >
      <div className="overflow-x-auto border-b border-border">
        <TabsList
          aria-label={ariaLabel}
          className="h-auto w-max justify-start gap-6 rounded-none bg-transparent p-0"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className="relative h-11 shrink-0 rounded-none border-0 bg-transparent px-0 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}

              {value === tab.value && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
