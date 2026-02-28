import { Icon } from "@iconify/react";
import { colord, random } from "colord";
import { useState } from "react";
import CopyButton from "../CopyButton";
import NumberInput from "../NumberInput";
import { ui } from "../uiClasses";

type ColorPaletteGeneratorToolProps = {
  onToast: () => void;
};

const generatePalette = (base: string, amount: number) => {
  const root = colord(base);
  if (!root.isValid()) return [];

  const total = Math.max(3, Math.min(12, Math.trunc(amount)));
  const midpoint = Math.floor(total / 2);

  return Array.from({ length: total }, (_, index) => {
    const shift = index - midpoint;
    if (shift === 0) return root.toHex();

    const rotated = root.rotate(shift * 14).saturate(0.08);
    const shaded =
      shift > 0
        ? rotated.lighten(Math.min(0.48, shift * 0.11))
        : rotated.darken(Math.min(0.48, Math.abs(shift) * 0.11));

    return shaded.toHex();
  });
};

export default function ColorPaletteGeneratorTool({
  onToast,
}: ColorPaletteGeneratorToolProps) {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [count, setCount] = useState(6);
  const [palette, setPalette] = useState<string[]>([]);

  const handleGenerate = () => {
    setPalette(generatePalette(baseColor, count));
  };

  const handleGenerateRandom = () => {
    const randomBase = random().toHex();
    setBaseColor(randomBase);
    setPalette(generatePalette(randomBase, count));
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Color Palette Generator</h2>
        <p className={ui.toolDescription}>
          Build palette variations from a base color.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="paletteBaseColor">
            Base color
          </label>
          <input
            id="paletteBaseColor"
            type="text"
            className={ui.compactInput}
            value={baseColor}
            onChange={(event) => setBaseColor(event.target.value)}
            placeholder="#6366f1"
          />
        </div>

        <div className="flex h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)]">
          <input
            type="color"
            className="h-full w-full border-0 bg-transparent p-0"
            value={
              colord(baseColor).isValid()
                ? colord(baseColor).toHex()
                : "#6366f1"
            }
            onChange={(event) => setBaseColor(event.target.value)}
            aria-label="pick base color"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="paletteCount">
            Colors
          </label>
          <NumberInput
            id="paletteCount"
            min={3}
            max={12}
            value={count}
            onChange={setCount}
            ariaLabel="palette color count"
          />
        </div>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={handleGenerate}
        >
          <Icon icon="tabler:palette" width="16" />
          Generate Palette
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={handleGenerateRandom}
        >
          <Icon icon="tabler:dice-5" width="16" />
          Random Palette
        </button>
      </div>

      <div className={ui.outputHead}>
        <p className={ui.fieldLabel}>Output</p>
        <CopyButton
          value={palette.join("\n")}
          onCopied={onToast}
          disabled={palette.length === 0}
          idleLabel="Copy all"
        />
      </div>

      {palette.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {palette.map((colorValue) => (
            <div
              key={colorValue}
              className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-2"
            >
              <div
                className="h-20 w-full rounded-lg border border-[color-mix(in_srgb,var(--bg)_35%,var(--border))]"
                style={{ backgroundColor: colorValue }}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))]">
                  {colorValue}
                </span>
                <CopyButton value={colorValue} onCopied={onToast} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={ui.emptyMeta}>Generated palette appears here.</p>
      )}
    </section>
  );
}
