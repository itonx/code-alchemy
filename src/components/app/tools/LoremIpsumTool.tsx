import { Icon } from "@iconify/react";
import { loremIpsum } from "lorem-ipsum";
import { useState } from "react";
import CopyButton from "../CopyButton";
import NumberInput from "../NumberInput";
import { ui } from "../uiClasses";

type LoremIpsumToolProps = {
  onToast: () => void;
};

type LoremUnit = "words" | "sentences" | "paragraphs";

export default function LoremIpsumTool({ onToast }: LoremIpsumToolProps) {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [result, setResult] = useState("");

  const generateLorem = () => {
    const safeCount = Math.max(1, Math.min(50, Math.trunc(count)));
    const text = loremIpsum({
      count: safeCount,
      units: unit,
      format: unit === "words" ? "plain" : "html",
    });

    const normalized =
      unit === "words"
        ? text
        : text
            .replace(/<\/?p>/g, "")
            .replace(/<\/p>\s*<p>/g, "\n\n")
            .trim();

    setResult(normalized);
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Lorem Ipsum Generator</h2>
        <p className={ui.toolDescription}>
          Generate placeholder text for designs and drafts.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="loremCount">
            Count
          </label>
          <NumberInput
            id="loremCount"
            min={1}
            max={50}
            value={count}
            onChange={setCount}
            ariaLabel="lorem count"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="loremUnit">
            Unit
          </label>
          <select
            id="loremUnit"
            className={ui.compactInput}
            value={unit}
            onChange={(event) => setUnit(event.target.value as LoremUnit)}
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={generateLorem}
        >
          <Icon icon="tabler:file-text" width="16" />
          Generate
        </button>
      </div>

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="loremOutput">
          Output
        </label>
        <CopyButton value={result} onCopied={onToast} disabled={!result} />
      </div>

      <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
        <textarea
          id="loremOutput"
          className={ui.textArea}
          value={result}
          readOnly
          placeholder="Generated text appears here"
        />
      </div>
    </section>
  );
}
