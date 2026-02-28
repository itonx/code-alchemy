import { Icon } from "@iconify/react";
import CryptoJS from "crypto-js";
import { useRef, useState } from "react";
import CopyButton from "../CopyButton";
import OptionCheckbox from "../OptionCheckbox";
import { ui } from "../uiClasses";

type HashGeneratorToolProps = {
  onToast: () => void;
};

type HashResult = {
  algorithm: "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
  value: string;
};

const HASH_ALGORITHMS: HashResult["algorithm"][] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

const toWordArray = (bytes: Uint8Array) => {
  const words: number[] = [];
  for (let index = 0; index < bytes.length; index += 1) {
    words[index >>> 2] |= bytes[index] << (24 - (index % 4) * 8);
  }

  return CryptoJS.lib.WordArray.create(words, bytes.length);
};

const createHashes = (
  payload: CryptoJS.lib.WordArray | string,
): HashResult[] => [
  { algorithm: "MD5", value: CryptoJS.MD5(payload).toString(CryptoJS.enc.Hex) },
  {
    algorithm: "SHA-1",
    value: CryptoJS.SHA1(payload).toString(CryptoJS.enc.Hex),
  },
  {
    algorithm: "SHA-256",
    value: CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex),
  },
  {
    algorithm: "SHA-384",
    value: CryptoJS.SHA384(payload).toString(CryptoJS.enc.Hex),
  },
  {
    algorithm: "SHA-512",
    value: CryptoJS.SHA512(payload).toString(CryptoJS.enc.Hex),
  },
];

const formatHashOutput = (items: HashResult[]) =>
  items.map((item) => `${item.algorithm}: ${item.value}`).join("\n");

export default function HashGeneratorTool({ onToast }: HashGeneratorToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercaseOutput, setUppercaseOutput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generateHashesFromFile = async (file: File) => {
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    setHashes(createHashes(toWordArray(fileBytes)));
  };

  const generateHash = async () => {
    if (!inputValue && !selectedFile) {
      setHashes([]);
      return;
    }

    if (inputValue.trim()) {
      if (selectedFile) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      setHashes(createHashes(inputValue));
      return;
    }

    if (selectedFile) {
      await generateHashesFromFile(selectedFile);
      return;
    }
  };

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setInputValue("");
    setSelectedFile(file);
    await generateHashesFromFile(file);
  };

  const normalizedHashes = uppercaseOutput
    ? hashes.map((item) => ({ ...item, value: item.value.toUpperCase() }))
    : hashes;

  const outputValue = formatHashOutput(normalizedHashes);

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Hash Generator</h2>
        <p className={ui.toolDescription}>
          Generate MD5 + SHA hashes from text or files.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className={ui.fileMeta}>
          Algorithms: {HASH_ALGORITHMS.join(", ")}
        </span>
        <label className={ui.button} htmlFor="hashFileInput">
          <Icon icon="tabler:upload" width="16" />
          Select File
        </label>
        <input
          ref={fileInputRef}
          id="hashFileInput"
          type="file"
          className="hidden"
          onChange={(event) => void handleFileSelection(event)}
        />
        {selectedFile ? (
          <span className={ui.fileMeta}>Using file: {selectedFile.name}</span>
        ) : null}
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-3">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <label className={ui.fieldLabel} htmlFor="hashInput">
            Text Input
          </label>

          <div className={`${ui.textAreaFrame} min-h-[150px] flex-1`}>
            <textarea
              id="hashInput"
              className={ui.textArea}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type text to hash (file takes priority when selected)"
            />
          </div>

          <div className="flex items-center justify-start">
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={() => void generateHash()}
            >
              <Icon icon="tabler:fingerprint" width="16" />
              Generate
            </button>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className={`${ui.outputHead} flex-wrap`}>
            <div className="flex items-center gap-2">
              <label className={ui.fieldLabel}>Hash Output</label>
              <OptionCheckbox
                id="hashUppercaseOutput"
                label="Uppercase output"
                checked={uppercaseOutput}
                onChange={setUppercaseOutput}
              />
            </div>
            <CopyButton
              value={outputValue}
              onCopied={onToast}
              disabled={!outputValue}
              idleLabel="Copy all"
            />
          </div>

          {normalizedHashes.length > 0 ? (
            <div className="flex min-h-[300px] flex-1 flex-col gap-2 overflow-auto">
              {normalizedHashes.map((item) => (
                <div
                  key={item.algorithm}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] p-2"
                >
                  <div className="min-w-0">
                    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {item.algorithm}
                    </p>
                    <p className="m-0 truncate text-sm text-[color-mix(in_srgb,var(--accent)_28%,var(--muted))]">
                      {item.value}
                    </p>
                  </div>
                  <CopyButton value={item.value} onCopied={onToast} />
                </div>
              ))}
            </div>
          ) : (
            <p className={ui.emptyMeta}>Hash results appear here</p>
          )}
        </div>
      </div>
    </section>
  );
}
