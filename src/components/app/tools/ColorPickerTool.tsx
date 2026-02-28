import { HexColorPicker } from "react-colorful";
import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type ColorPickerToolProps = {
  onToast: () => void;
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;

  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

export default function ColorPickerTool({ onToast }: ColorPickerToolProps) {
  const [color, setColor] = useState("#6366f1");

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const rgbText = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "Invalid RGB";

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Color Picker</h2>
        <p className={ui.toolDescription}>
          Pick colors visually and copy HEX or RGB values.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 min-[920px]:grid-cols-[340px_1fr]">
        <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-3">
          <HexColorPicker
            color={color}
            onChange={setColor}
            style={{ width: "100%" }}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div
            className="h-28 rounded-xl border border-[color-mix(in_srgb,var(--bg)_35%,var(--border))]"
            style={{ backgroundColor: color }}
          />

          <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-3">
            <label className={ui.fieldLabel} htmlFor="colorHexInput">
              HEX
            </label>
            <div className="mt-2 flex items-center justify-between gap-2">
              <input
                id="colorHexInput"
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className={ui.compactInput}
              />
              <CopyButton value={color} onCopied={onToast} />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-3">
            <p className={ui.fieldLabel}>RGB</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="m-0 text-sm text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))]">
                {rgbText}
              </p>
              <CopyButton value={rgbText} onCopied={onToast} disabled={!rgb} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
