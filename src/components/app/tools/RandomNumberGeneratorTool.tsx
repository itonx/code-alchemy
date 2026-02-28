import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import NumberInput from "../NumberInput";
import OptionCheckbox from "../OptionCheckbox";
import { ui } from "../uiClasses";

type RandomNumberGeneratorToolProps = {
  onToast: () => void;
};

const roundToDecimals = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export default function RandomNumberGeneratorTool({
  onToast,
}: RandomNumberGeneratorToolProps) {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [count, setCount] = useState(1);
  const [decimals, setDecimals] = useState(0);
  const [integerOnly, setIntegerOnly] = useState(true);
  const [result, setResult] = useState("");

  const generateNumbers = () => {
    const safeMin = Math.min(minValue, maxValue);
    const safeMax = Math.max(minValue, maxValue);
    const safeCount = Math.max(1, Math.min(200, Math.trunc(count)));
    const safeDecimals = Math.max(0, Math.min(10, Math.trunc(decimals)));

    const values: string[] = [];
    for (let index = 0; index < safeCount; index += 1) {
      const raw = Math.random() * (safeMax - safeMin) + safeMin;
      if (integerOnly) {
        values.push(String(Math.round(raw)));
      } else {
        values.push(roundToDecimals(raw, safeDecimals).toFixed(safeDecimals));
      }
    }

    setResult(values.join("\n"));
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Random Number Generator</h2>
        <p className={ui.toolDescription}>
          Generate random numbers within a custom range.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="rngMin">
            Min
          </label>
          <NumberInput
            id="rngMin"
            value={minValue}
            onChange={setMinValue}
            ariaLabel="minimum value"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="rngMax">
            Max
          </label>
          <NumberInput
            id="rngMax"
            value={maxValue}
            onChange={setMaxValue}
            ariaLabel="maximum value"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="rngCount">
            Count
          </label>
          <NumberInput
            id="rngCount"
            min={1}
            max={200}
            value={count}
            onChange={setCount}
            ariaLabel="count"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="rngIntegerOnly">
            Integer only
          </label>
          <OptionCheckbox
            id="rngIntegerOnly"
            label="Enabled"
            checked={integerOnly}
            onChange={setIntegerOnly}
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="rngDecimals">
            Decimals
          </label>
          <NumberInput
            id="rngDecimals"
            min={0}
            max={10}
            value={decimals}
            onChange={setDecimals}
            disabled={integerOnly}
            ariaLabel="decimals"
          />
        </div>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={generateNumbers}
        >
          <Icon icon="tabler:dice-6" width="16" />
          Generate
        </button>
      </div>

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="rngOutput">
          Output
        </label>
        <CopyButton value={result} onCopied={onToast} disabled={!result} />
      </div>

      <div className={`${ui.textAreaFrame} min-h-[260px] flex-1`}>
        <textarea
          id="rngOutput"
          className={ui.textArea}
          value={result}
          readOnly
          placeholder="Generated numbers appear here"
        />
      </div>
    </section>
  );
}
