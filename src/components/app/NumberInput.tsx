import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { ui } from "./uiClasses";

type NumberInputProps = {
  id: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const clamp = (value: number, min?: number, max?: number) => {
  let nextValue = value;
  if (typeof min === "number") {
    nextValue = Math.max(min, nextValue);
  }
  if (typeof max === "number") {
    nextValue = Math.min(max, nextValue);
  }
  return nextValue;
};

export default function NumberInput({
  id,
  min,
  max,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  disabled = false,
  ariaLabel,
}: NumberInputProps) {
  const isControlled = typeof value === "number";
  const [internalValue, setInternalValue] = useState(() =>
    clamp(defaultValue, min, max),
  );

  const currentValue = useMemo(() => {
    if (isControlled) {
      return clamp(Number(value), min, max);
    }
    return clamp(internalValue, min, max);
  }, [internalValue, isControlled, max, min, value]);

  const [displayValue, setDisplayValue] = useState(String(currentValue));

  useEffect(() => {
    setDisplayValue(String(currentValue));
  }, [currentValue]);

  const commit = (nextValue: number) => {
    const safeValue = clamp(Math.trunc(nextValue), min, max);
    if (!isControlled) {
      setInternalValue(safeValue);
    }
    onChange(safeValue);
    setDisplayValue(String(safeValue));
  };

  const isValidPartialInteger = (nextValue: string) => {
    if (nextValue === "") return true;

    const allowsNegative = typeof min !== "number" || min < 0;
    if (nextValue === "-") return allowsNegative;

    let startIndex = 0;
    if (nextValue[0] === "-") {
      if (!allowsNegative) return false;
      if (nextValue.length === 1) return true;
      startIndex = 1;
    }

    for (let index = startIndex; index < nextValue.length; index += 1) {
      const code = nextValue.charCodeAt(index);
      if (code < 48 || code > 57) {
        return false;
      }
    }

    return true;
  };

  const commitFromText = () => {
    const parsedValue = Number(displayValue);
    if (displayValue.trim() === "" || !Number.isFinite(parsedValue)) {
      setDisplayValue(String(currentValue));
      return;
    }

    commit(parsedValue);
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        className={`${ui.compactInput} pr-20`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={displayValue}
        disabled={disabled}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (isValidPartialInteger(nextValue)) {
            setDisplayValue(nextValue);
          }
        }}
        onBlur={commitFromText}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitFromText();
          }
        }}
      />

      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[color-mix(in_srgb,var(--accent)_45%,var(--muted))] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => commit(currentValue - step)}
            disabled={disabled}
            aria-label={`Decrease ${ariaLabel ?? id}`}
          >
            <Icon icon="tabler:minus" width="14" />
          </button>

          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[color-mix(in_srgb,var(--accent)_45%,var(--muted))] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => commit(currentValue + step)}
            disabled={disabled}
            aria-label={`Increase ${ariaLabel ?? id}`}
          >
            <Icon icon="tabler:plus" width="14" />
          </button>
        </div>
      </div>
    </div>
  );
}
