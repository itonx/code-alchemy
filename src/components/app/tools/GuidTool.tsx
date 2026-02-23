import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import NumberInput from "../NumberInput";
import OptionCheckbox from "../OptionCheckbox";
import { ui } from "../uiClasses";

type GuidToolProps = {
  onToast: () => void;
};

export default function GuidTool({ onToast }: GuidToolProps) {
  const [rawGuids, setRawGuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [caseMode, setCaseMode] = useState<"lowercase" | "uppercase">(
    "lowercase",
  );
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [includeBraces, setIncludeBraces] = useState(false);

  const outputValues = useMemo(() => {
    return rawGuids.map((rawGuid) => {
      const compact = rawGuid.replace(/-/g, "");
      const withHyphens = includeHyphens
        ? `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`
        : compact;
      const withCase =
        caseMode === "uppercase"
          ? withHyphens.toUpperCase()
          : withHyphens.toLowerCase();

      return includeBraces ? `{${withCase}}` : withCase;
    });
  }, [rawGuids, caseMode, includeHyphens, includeBraces]);

  const guidOutput = useMemo(() => outputValues.join("\n"), [outputValues]);

  const generateGuid = () => {
    const safeCount = Math.max(1, Math.min(100, Math.trunc(count)));
    const generated = Array.from({ length: safeCount }, () =>
      crypto.randomUUID(),
    );
    setRawGuids(generated);
  };

  return (
    <section
      className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>GUID Generator</h2>
        <p className={ui.toolDescription}>
          Create RFC 4122 UUID values instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="guidCountInput">
            Count
          </label>
          <NumberInput
            id="guidCountInput"
            min={1}
            max={100}
            value={count}
            defaultValue={1}
            onChange={setCount}
            ariaLabel="GUID count"
          />
        </div>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={generateGuid}
        >
          <Icon icon="tabler:wand" width="16" />
          Generate GUID
        </button>
      </div>

      <div className={`${ui.outputHead} flex-wrap`}>
        <div className="flex flex-wrap items-center gap-2">
          <p className={ui.fieldLabel}>Result</p>
          <OptionCheckbox
            id="guidCaseMode"
            label="Uppercase"
            checked={caseMode === "uppercase"}
            onChange={(checked) =>
              setCaseMode(checked ? "uppercase" : "lowercase")
            }
          />

          <OptionCheckbox
            id="guidHyphenMode"
            label="Include hyphens"
            checked={includeHyphens}
            onChange={setIncludeHyphens}
          />

          <OptionCheckbox
            id="guidBraceMode"
            label="Include braces"
            checked={includeBraces}
            onChange={setIncludeBraces}
          />
        </div>
        <CopyButton
          value={guidOutput}
          onCopied={onToast}
          disabled={!guidOutput}
          idleLabel="Copy all"
        />
      </div>
      {outputValues.length > 0 ? (
        <div className="flex min-h-[220px] flex-1 flex-col gap-2 overflow-auto">
          {outputValues.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-2"
            >
              <span className="truncate text-sm text-[color-mix(in_srgb,var(--accent)_28%,var(--muted))]">
                {entry}
              </span>
              <CopyButton value={entry} onCopied={onToast} />
            </div>
          ))}
        </div>
      ) : (
        <p className={ui.emptyMeta}>Generated GUID will appear here</p>
      )}
    </section>
  );
}
