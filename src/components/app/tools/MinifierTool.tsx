import { Icon } from "@iconify/react";
import { useState } from "react";
import { minify as minifyJs } from "terser";
import CopyButton from "../CopyButton";
import type { ThemeMode } from "../types";
import { ui } from "../uiClasses";

type MinifierToolProps = {
  theme: ThemeMode;
  onToast: () => void;
};

type MinifierMode = "javascript" | "html" | "css" | "xml" | "sql" | "json";

const minifyXml = (value: string) =>
  value
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

const minifySql = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .trim();

const minifyCss = (value: string) =>
  value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

const minifyHtml = (value: string) =>
  value
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

export default function MinifierTool({ theme, onToast }: MinifierToolProps) {
  const [mode, setMode] = useState<MinifierMode>("json");
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [errorText, setErrorText] = useState("");

  const runMinify = async () => {
    if (!source.trim()) {
      setOutput("");
      setErrorText("");
      return;
    }

    try {
      if (mode === "javascript") {
        const result = await minifyJs(source, {
          compress: true,
          mangle: true,
        });
        setOutput(result.code ?? "");
      }

      if (mode === "html") {
        setOutput(minifyHtml(source));
      }

      if (mode === "css") {
        setOutput(minifyCss(source));
      }

      if (mode === "xml") {
        setOutput(minifyXml(source));
      }

      if (mode === "sql") {
        setOutput(minifySql(source));
      }

      if (mode === "json") {
        setOutput(JSON.stringify(JSON.parse(source)));
      }

      setErrorText("");
    } catch {
      setErrorText(`Unable to minify this input as ${mode.toUpperCase()}.`);
    }
  };

  return (
    <section
      className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Code Minifier</h2>
        <p className={ui.toolDescription}>
          Minify common code and markup formats.
        </p>
      </header>

      <div className="flex items-center gap-2">
        <select
          className={`${ui.compactInput} min-w-[200px] max-w-[260px]`}
          value={mode}
          onChange={(event) => setMode(event.target.value as MinifierMode)}
        >
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="xml">XML</option>
          <option value="sql">SQL</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="minifierInput">
              Input
            </label>
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={() => void runMinify()}
            >
              <Icon icon="tabler:arrows-minimize" width="16" />
              Minify
            </button>
          </div>
          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="minifierInput"
              className={ui.textArea}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Paste content to minify"
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="minifierOutput">
              Minified Output
            </label>
            <CopyButton value={output} onCopied={onToast} disabled={!output} />
          </div>

          <div
            id="minifierOutput"
            className={`${ui.codePreview} ${theme === "dark" ? "bg-[color-mix(in_srgb,var(--bg)_70%,var(--surface))]" : "bg-[color-mix(in_srgb,var(--surface)_94%,var(--bg))]"}`}
          >
            {output ? (
              <pre>
                <code>{output}</code>
              </pre>
            ) : (
              <p className={ui.emptyMeta}>Minified output appears here.</p>
            )}
          </div>

          {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}
        </div>
      </div>
    </section>
  );
}
