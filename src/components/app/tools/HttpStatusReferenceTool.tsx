import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import statuses from "statuses";
import { ui } from "../uiClasses";

type StatusEntry = {
  code: number;
  message: string;
};

const STATUS_GROUPS = [
  { label: "Informational", min: 100, max: 199 },
  { label: "Success", min: 200, max: 299 },
  { label: "Redirection", min: 300, max: 399 },
  { label: "Client Error", min: 400, max: 499 },
  { label: "Server Error", min: 500, max: 599 },
];

const CATEGORY_OPTIONS = [
  "All",
  ...STATUS_GROUPS.map((group) => group.label),
  "Other",
] as const;

type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];

const entries: StatusEntry[] = statuses.codes
  .map((code) => ({ code, message: statuses.message[code] }))
  .filter((entry) => Boolean(entry.message));

const getGroupLabel = (code: number) =>
  STATUS_GROUPS.find((group) => code >= group.min && code <= group.max)
    ?.label ?? "Other";

export default function HttpStatusReferenceTool() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const groupLabel = getGroupLabel(entry.code);
      if (categoryFilter !== "All" && groupLabel !== categoryFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const codeText = String(entry.code);
      const messageText = entry.message.toLowerCase();
      const groupText = groupLabel.toLowerCase();
      return (
        codeText.includes(query) ||
        messageText.includes(query) ||
        groupText.includes(query)
      );
    });
  }, [categoryFilter, search]);

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>HTTP Status Code Reference</h2>
        <p className={ui.toolDescription}>
          Browse HTTP status codes and meanings.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-[320px]">
          <Icon
            icon="tabler:search"
            width="16"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            type="text"
            className={`${ui.compactInput} pl-9`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search code or text"
          />
        </div>

        <select
          className={`${ui.compactInput} w-full max-w-[220px]`}
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as CategoryFilter)
          }
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-h-[280px] flex-1 flex-col overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-[110px_1fr_170px] gap-2 border-b border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          <span>Code</span>
          <span>Message</span>
          <span>Category</span>
        </div>

        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div
              key={entry.code}
              className="grid grid-cols-[110px_1fr_170px] gap-2 border-b border-[color-mix(in_srgb,var(--border)_75%,transparent)] px-3 py-2 text-sm text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))] last:border-b-0"
            >
              <span className="font-semibold text-[var(--accent)]">
                {entry.code}
              </span>
              <span>{entry.message}</span>
              <span>{getGroupLabel(entry.code)}</span>
            </div>
          ))
        ) : (
          <p className="m-0 p-3 text-sm text-[var(--muted)]">
            No status codes found.
          </p>
        )}
      </div>
    </section>
  );
}
