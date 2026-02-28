import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useMemo, useRef, useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

dayjs.extend(utc);
dayjs.extend(timezone);

type TimezoneConverterToolProps = {
  onToast: () => void;
};

const FALLBACK_TIMEZONE_OPTIONS = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const getTimezoneOptions = () => {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    const values = (
      Intl as Intl & {
        supportedValuesOf: (key: "timeZone") => string[];
      }
    ).supportedValuesOf("timeZone");

    if (Array.isArray(values) && values.length > 0) {
      return values;
    }
  }

  return FALLBACK_TIMEZONE_OPTIONS;
};

const getUserTimezone = () => {
  if (typeof Intl === "undefined") return "";
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
};

type SearchableTimezoneSelectProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (zone: string) => void;
};

function SearchableTimezoneSelect({
  id,
  label,
  value,
  options,
  onChange,
}: SearchableTimezoneSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const visibleOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((zone) => zone.toLowerCase().includes(query));
  }, [options, search]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className={ui.optionCard} ref={wrapperRef}>
      <label className={ui.fieldLabel} htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <button
          id={id}
          type="button"
          className={`${ui.compactInput} flex items-center justify-between gap-2`}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="truncate">{value}</span>
          <Icon icon="tabler:chevron-down" width="16" />
        </button>

        {isOpen ? (
          <div className="absolute left-0 top-[calc(100%+0.35rem)] z-20 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_16px_28px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-2 py-1.5">
              <Icon icon="tabler:search" width="14" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search TZ identifier"
                className="w-full border-0 bg-transparent text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))] outline-none"
              />
            </div>

            <div className="mt-2 flex max-h-[240px] flex-col gap-1 overflow-auto">
              {visibleOptions.length > 0 ? (
                visibleOptions.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    className={`rounded-lg border px-2 py-1.5 text-left font-semibold ${
                      zone === value
                        ? "border-[color-mix(in_srgb,var(--accent)_26%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)]"
                        : "border-transparent bg-transparent text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))]"
                    }`}
                    onClick={() => {
                      onChange(zone);
                      setSearch("");
                      setIsOpen(false);
                    }}
                  >
                    {zone}
                  </button>
                ))
              ) : (
                <p className="m-0 px-2 py-1.5 text-sm text-[var(--muted)]">
                  No matching timezone identifier.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const OUTPUT_FORMAT = "YYYY-MM-DD HH:mm:ss z";

export default function TimezoneConverterTool({
  onToast,
}: TimezoneConverterToolProps) {
  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);
  const defaultFromZone = useMemo(() => {
    const userTimezone = getUserTimezone();
    if (timezoneOptions.includes(userTimezone)) {
      return userTimezone;
    }

    return timezoneOptions[0] ?? "UTC";
  }, [timezoneOptions]);
  const dateTimeInputRef = useRef<HTMLInputElement | null>(null);
  const [inputDateTime, setInputDateTime] = useState("");
  const [fromZone, setFromZone] = useState(defaultFromZone);
  const [toZone, setToZone] = useState("America/New_York");

  useEffect(() => {
    if (!timezoneOptions.includes(fromZone)) {
      setFromZone(defaultFromZone);
    }

    if (!timezoneOptions.includes(toZone)) {
      setToZone(
        timezoneOptions.includes("America/New_York")
          ? "America/New_York"
          : (timezoneOptions[0] ?? "UTC"),
      );
    }
  }, [defaultFromZone, fromZone, toZone, timezoneOptions]);

  const output = useMemo(() => {
    if (!inputDateTime) return "";

    const parsed = dayjs.tz(inputDateTime, fromZone);
    if (!parsed.isValid()) return "Invalid date/time";

    return parsed.tz(toZone).format(OUTPUT_FORMAT);
  }, [fromZone, inputDateTime, toZone]);

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Timezone Converter</h2>
        <p className={ui.toolDescription}>
          Convert date and time values between timezones.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 min-[720px]:grid-cols-[max-content_280px_280px]">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="tzInputDateTime">
            Date & Time
          </label>
          <div className="relative inline-flex w-fit max-w-full">
            <input
              ref={dateTimeInputRef}
              id="tzInputDateTime"
              type="datetime-local"
              className={`${ui.compactInput} !w-[24ch] max-w-full pr-10 [color-scheme:light_dark] [&::-webkit-calendar-picker-indicator]:opacity-0`}
              value={inputDateTime}
              onChange={(event) => setInputDateTime(event.target.value)}
            />
            <button
              type="button"
              aria-label="Open date and time picker"
              className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-[var(--accent)]"
              onClick={() => {
                dateTimeInputRef.current?.showPicker?.();
                dateTimeInputRef.current?.focus();
              }}
            >
              <Icon icon="tabler:calendar" width="16" />
            </button>
          </div>
        </div>

        <SearchableTimezoneSelect
          id="tzFrom"
          label="From"
          value={fromZone}
          options={timezoneOptions}
          onChange={setFromZone}
        />

        <SearchableTimezoneSelect
          id="tzTo"
          label="To"
          value={toZone}
          options={timezoneOptions}
          onChange={setToZone}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-3">
        <div className="flex items-center justify-between gap-2">
          <p className={ui.fieldLabel}>Converted Output</p>
          <CopyButton
            value={output}
            onCopied={onToast}
            disabled={!output || output === "Invalid date/time"}
          />
        </div>
        <p className="m-0 mt-2 text-sm text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))]">
          {output || "Select date/time to convert."}
        </p>
      </div>

      <p className={ui.fileMeta}>
        <Icon icon="tabler:clock" width="14" /> Format: {OUTPUT_FORMAT}
      </p>
    </section>
  );
}
