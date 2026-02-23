import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import shelterVaultLogo from "../../../assets/ShelterVault.png";
import CopyButton from "../CopyButton";
import NumberInput from "../NumberInput";
import OptionCheckbox from "../OptionCheckbox";
import { ui } from "../uiClasses";

type PasswordGeneratorToolProps = {
  onToast: () => void;
};

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-={}[]:;,.?";

const pickRandomChar = (charset: string) => {
  const randomIndex =
    crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
  return charset[randomIndex];
};

const generatePassword = (length: number, charset: string) => {
  const chars: string[] = [];
  for (let index = 0; index < length; index += 1) {
    chars.push(pickRandomChar(charset));
  }
  return chars.join("");
};

export default function PasswordGeneratorTool({
  onToast,
}: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(12);
  const [count, setCount] = useState(1);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [result, setResult] = useState("");
  const [errorText, setErrorText] = useState("");

  const charset = useMemo(() => {
    let aggregate = "";
    if (useLowercase) aggregate += LOWERCASE;
    if (useUppercase) aggregate += UPPERCASE;
    if (useDigits) aggregate += DIGITS;
    if (useSymbols) aggregate += SYMBOLS;
    return aggregate;
  }, [useLowercase, useUppercase, useDigits, useSymbols]);

  const outputValues = useMemo(
    () => result.split("\n").filter((entry) => entry.trim().length > 0),
    [result],
  );

  const handleGenerate = () => {
    const safeLength = Math.max(4, Math.min(128, Math.trunc(length)));
    const safeCount = Math.max(1, Math.min(50, Math.trunc(count)));

    if (!charset) {
      setErrorText("Select at least one character group.");
      return;
    }

    const generated: string[] = [];
    for (let index = 0; index < safeCount; index += 1) {
      generated.push(generatePassword(safeLength, charset));
    }

    setResult(generated.join("\n"));
    setErrorText("");
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Password Generator</h2>
        <p className={ui.toolDescription}>
          Generate secure random passwords with custom rules.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 items-end">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="passwordLength">
            Password length
          </label>
          <NumberInput
            id="passwordLength"
            min={4}
            max={128}
            value={length}
            defaultValue={12}
            onChange={setLength}
            ariaLabel="password length"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="passwordCount">
            Password count
          </label>
          <NumberInput
            id="passwordCount"
            min={1}
            max={50}
            value={count}
            defaultValue={1}
            onChange={setCount}
            ariaLabel="password count"
          />
        </div>

        <OptionCheckbox
          id="passwordUseLowercase"
          label="Lowercase"
          checked={useLowercase}
          onChange={setUseLowercase}
        />

        <OptionCheckbox
          id="passwordUseUppercase"
          label="Uppercase"
          checked={useUppercase}
          onChange={setUseUppercase}
        />

        <OptionCheckbox
          id="passwordUseDigits"
          label="Digits"
          checked={useDigits}
          onChange={setUseDigits}
        />

        <OptionCheckbox
          id="passwordUseSymbols"
          label="Symbols"
          checked={useSymbols}
          onChange={setUseSymbols}
        />
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={handleGenerate}
        >
          <Icon icon="tabler:key" width="16" />
          Generate Passwords
        </button>
      </div>

      <div className={ui.outputHead}>
        <p className={ui.fieldLabel}>Output</p>
        <CopyButton
          value={result}
          onCopied={onToast}
          disabled={!result}
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
        <p className={ui.emptyMeta}>Generated passwords appear here</p>
      )}

      {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}

      <a
        className="mt-auto flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-3 text-[color-mix(in_srgb,var(--accent)_45%,var(--muted))] no-underline"
        href="https://apps.microsoft.com/detail/9nhvsnjsx74g?hl=en-US&gl=BB"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={shelterVaultLogo.src}
          alt="ShelterVault logo"
          className="h-[34px] w-[34px] rounded-md object-cover"
        />
        <span>
          Recommended password manager: <strong>ShelterVault</strong>
        </span>
      </a>
    </section>
  );
}
