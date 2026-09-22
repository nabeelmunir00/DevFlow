import type { ProjectActivityCategory } from "../../../types/activity";

export type ActivityCategoryFilter = "ALL" | ProjectActivityCategory;

interface ActivityCategoryTabsProps {
  value: ActivityCategoryFilter;
  onValueChange: (value: ActivityCategoryFilter) => void;
}

const categories: {
  value: ActivityCategoryFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "TASK",
    label: "Tasks",
  },
  {
    value: "PULL_REQUEST",
    label: "Pull requests",
  },
  {
    value: "COMMENT",
    label: "Comments",
  },
  {
    value: "SPRINT",
    label: "Sprints",
  },
];

export function ActivityCategoryTabs({
  value,
  onValueChange,
}: ActivityCategoryTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const active = value === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onValueChange(category.value)}
            className={[
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
