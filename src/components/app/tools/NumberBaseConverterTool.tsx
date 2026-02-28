import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type NumberBaseConverterToolProps = {
  onToast: () => void;
};

type BaseMode = "2" | "8" | "10" | "16";

const BASE_OPTIONS: { value: BaseMode; label: string }[] = [
  { value: "2", label: "Binary (2)" },
  { value: "8", label: "Octal (8)" },
  { value: "10", label: "Decimal (10)" },
  { value: "16", label: "Hex (16)" },
];

const parseByBase = (value: string, base: number) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number.parseInt(trimmed, base);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export default function NumberBaseConverterTool({
  onToast,
}: NumberBaseConverterToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState<BaseMode>("10");

  const converted = useMemo(() => {
    const decimal = parseByBase(inputValue, Number.parseInt(inputBase, 10));
    if (decimal === null) {
      return {
        binary: "",
        octal: "",
        decimal: "",
        hex: "",
      };
    }

    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase(),
    };
  }, [inputBase, inputValue]);

  const hasOutput = Boolean(converted.decimal);

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Number Base Converter</h2>
        <p className={ui.toolDescription}>
          Convert numbers across binary, octal, decimal, and hex.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 min-[920px]:grid-cols-[220px_1fr]">
        <select
          className={ui.compactInput}
          value={inputBase}
          onChange={(event) => setInputBase(event.target.value as BaseMode)}
        >
          {BASE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          className={ui.compactInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Type number in selected base"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {[
          { label: "Binary", value: converted.binary },
          { label: "Octal", value: converted.octal },
          { label: "Decimal", value: converted.decimal },
          { label: "Hex", value: converted.hex },
        ].map((entry) => (
          <div
            key={entry.label}
            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className={ui.fieldLabel}>{entry.label}</p>
              <CopyButton
                value={entry.value}
                onCopied={onToast}
                disabled={!entry.value}
              />
            </div>
            <p className="m-0 mt-2 break-all text-sm text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))]">
              {entry.value || "-"}
            </p>
          </div>
        ))}
      </div>

      {!hasOutput && inputValue.trim() ? (
        <p className={ui.errorMeta}>
          <Icon icon="tabler:alert-circle" width="16" /> Invalid number for the
          selected base.
        </p>
      ) : null}
    </section>
  );
}
