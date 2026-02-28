import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { format, getSupportInfo } from "prettier/standalone";
import * as pluginBabel from "prettier/plugins/babel";
import * as pluginEstree from "prettier/plugins/estree";
import * as pluginHtml from "prettier/plugins/html";
import * as pluginMarkdown from "prettier/plugins/markdown";
import * as pluginPostcss from "prettier/plugins/postcss";
import * as pluginTypescript from "prettier/plugins/typescript";
import * as pluginYaml from "prettier/plugins/yaml";
import hljs from "highlight.js/lib/core";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import * as hljsLanguageModules from "react-syntax-highlighter/dist/esm/languages/hljs";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { ThemeMode } from "../types";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type CodeFormatterToolProps = {
  theme: ThemeMode;
  onToast: () => void;
};

type DetectedLanguage = {
  hljs: string;
};

type HljsLanguageFactory = (hljsInstance: unknown) => unknown;

const ALL_HLJS_LANGUAGES = Object.entries(hljsLanguageModules).filter(
  (entry): entry is [string, HljsLanguageFactory] =>
    typeof entry[1] === "function",
);

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  yml: "yaml",
  md: "markdown",
  cs: "csharp",
};

const PRETTIER_LANGUAGE_ALIASES: Record<string, string[]> = {
  xml: ["html"],
  vue: ["html"],
  angular: ["html"],
  js: ["javascript"],
  ts: ["typescript"],
  yml: ["yaml"],
  md: ["markdown"],
};

const prettierPlugins = [
  pluginBabel,
  pluginEstree,
  pluginHtml,
  pluginMarkdown,
  pluginPostcss,
  pluginTypescript,
  pluginYaml,
];

const toLookupKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^[.]/, "")
    .replace(/[\s_]+/g, "-");

const normalizeLanguageName = (languageName: string) =>
  LANGUAGE_ALIASES[languageName] ?? languageName;

let prettierParserLookupPromise: Promise<Map<string, string>> | null = null;

const getPrettierParserLookup = async () => {
  if (!prettierParserLookupPromise) {
    prettierParserLookupPromise = (async () => {
      const supportInfo = await Promise.resolve(
        getSupportInfo(),
      );
      const map = new Map<string, string>();

      for (const language of supportInfo.languages) {
        const parser = language.parsers?.[0];
        if (!parser) continue;

        const candidates = [
          language.name,
          ...(language.aliases ?? []),
          ...(language.extensions ?? []),
          ...(language.filenames ?? []),
          ...(language.interpreters ?? []),
          ...(language.vscodeLanguageIds ?? []),
        ].filter((item): item is string => typeof item === "string");

        for (const candidate of candidates) {
          const key = toLookupKey(candidate);
          if (!map.has(key)) {
            map.set(key, parser);
          }
        }
      }

      return map;
    })();
  }

  return prettierParserLookupPromise;
};

const resolveParserForLanguage = async (languageName: string) => {
  const lookup = await getPrettierParserLookup();
  const normalized = toLookupKey(languageName);
  const aliasCandidates = PRETTIER_LANGUAGE_ALIASES[normalized] ?? [];
  const candidates = [normalized, ...aliasCandidates.map(toLookupKey)];

  for (const candidate of candidates) {
    const parser = lookup.get(candidate);
    if (parser) return parser;
  }

  return null;
};

for (const [name, languageFactory] of ALL_HLJS_LANGUAGES) {
  SyntaxHighlighter.registerLanguage(name, languageFactory);
  hljs.registerLanguage(name, languageFactory);
}

export default function CodeFormatterTool({
  theme,
  onToast,
}: CodeFormatterToolProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [detectedLanguage, setDetectedLanguage] =
    useState<DetectedLanguage | null>(null);

  const detectLanguage = (input: string) => {
    const highlighted = hljs.highlightAuto(input);
    if (!highlighted.language) return null;

    const normalized = normalizeLanguageName(highlighted.language);
    return {
      hljs: normalized,
    };
  };

  const runFormat = async () => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setDetectedLanguage(null);
      return;
    }

    const language = detectLanguage(sourceCode);
    setDetectedLanguage(language);

    if (!language) {
      setFormattedCode("");
      return;
    }

    const parser = await resolveParserForLanguage(language.hljs);
    if (!parser) {
      setFormattedCode(sourceCode);
      return;
    }

    try {
      const output = await format(sourceCode, {
        parser,
        plugins: prettierPlugins,
      });
      setFormattedCode(output);
    } catch {
      setFormattedCode(sourceCode);
    }
  };

  useEffect(() => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setDetectedLanguage(null);
      return;
    }

    setDetectedLanguage(detectLanguage(sourceCode));
  }, [sourceCode]);

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Code Formatter</h2>
        <p className={ui.toolDescription}>
          Format source code with language-aware rules.
        </p>
      </header>

      <div className="relative z-[1] grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="formatterInput">
              Input
            </label>
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={() => void runFormat()}
            >
              <Icon icon="tabler:sparkles" width="16" />
              Format
            </button>
          </div>
          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="formatterInput"
              className={ui.textArea}
              value={sourceCode}
              onChange={(event) => setSourceCode(event.target.value)}
              placeholder="Paste code here"
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="formatterOutput">
              Formatted Output
            </label>
            <CopyButton
              value={formattedCode}
              onCopied={onToast}
              disabled={!formattedCode}
            />
          </div>
          <div
            id="formatterOutput"
            className={`${ui.codePreview} ${theme === "dark" ? "bg-[color-mix(in_srgb,var(--bg)_70%,var(--surface))]" : "bg-[color-mix(in_srgb,var(--surface)_94%,var(--bg))]"}`}
          >
            {formattedCode ? (
              <SyntaxHighlighter
                language={detectedLanguage?.hljs}
                style={theme === "dark" ? atomOneDark : atomOneLight}
                customStyle={{
                  margin: 0,
                  minHeight: "100%",
                  background: "transparent",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "inherit",
                  },
                }}
                wrapLongLines
              >
                {formattedCode}
              </SyntaxHighlighter>
            ) : (
              <p className={ui.emptyMeta}>Formatted code will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
