import { Icon } from "@iconify/react";
import DiffViewer from "react-diff-viewer-continued";
import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type TextDiffToolProps = {
  onToast: () => void;
};

const countLines = (value: string) => {
  if (!value) return 0;
  return value.split(/\r?\n/).length;
};

export default function TextDiffTool({ onToast }: TextDiffToolProps) {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [leftFileName, setLeftFileName] = useState("");
  const [rightFileName, setRightFileName] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  const runDiff = () => {
    setHasCompared(true);
  };

  const loadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    if (side === "left") {
      setLeftText(text);
      setLeftFileName(file.name);
      return;
    }

    setRightText(text);
    setRightFileName(file.name);
  };

  const summary = useMemo(() => {
    const leftLines = countLines(leftText);
    const rightLines = countLines(rightText);
    return `${leftLines} line(s) vs ${rightLines} line(s)`;
  }, [leftText, rightText]);

  const copyValue = useMemo(
    () =>
      [
        `--- ${leftFileName || "Original"}`,
        leftText,
        `+++ ${rightFileName || "Modified"}`,
        rightText,
      ].join("\n"),
    [leftFileName, leftText, rightFileName, rightText],
  );

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Text Diff Checker</h2>
        <p className={ui.toolDescription}>
          Compare two texts or files and inspect unified diff output.
        </p>
      </header>

      <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
        <p className={ui.fileMeta}>{summary}</p>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={runDiff}
        >
          <Icon icon="tabler:git-compare" width="16" />
          Compare
        </button>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.4rem] items-center justify-between gap-2">
            <label className={ui.fieldLabel} htmlFor="diffLeftInput">
              Original
            </label>
            <label className={ui.button} htmlFor="diffLeftFile">
              <Icon icon="tabler:upload" width="16" />
              Load File
            </label>
            <input
              id="diffLeftFile"
              type="file"
              className="hidden"
              onChange={(event) => void loadFile(event, "left")}
            />
          </div>
          <div className={`${ui.textAreaFrame} min-h-[220px]`}>
            <textarea
              id="diffLeftInput"
              className={ui.textArea}
              value={leftText}
              onChange={(event) => setLeftText(event.target.value)}
              placeholder="Original text"
            />
          </div>
          {leftFileName ? (
            <p className={ui.fileMeta}>File: {leftFileName}</p>
          ) : null}
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.4rem] items-center justify-between gap-2">
            <label className={ui.fieldLabel} htmlFor="diffRightInput">
              Modified
            </label>
            <label className={ui.button} htmlFor="diffRightFile">
              <Icon icon="tabler:upload" width="16" />
              Load File
            </label>
            <input
              id="diffRightFile"
              type="file"
              className="hidden"
              onChange={(event) => void loadFile(event, "right")}
            />
          </div>
          <div className={`${ui.textAreaFrame} min-h-[220px]`}>
            <textarea
              id="diffRightInput"
              className={ui.textArea}
              value={rightText}
              onChange={(event) => setRightText(event.target.value)}
              placeholder="Modified text"
            />
          </div>
          {rightFileName ? (
            <p className={ui.fileMeta}>File: {rightFileName}</p>
          ) : null}
        </div>
      </div>

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="diffOutput">
          Diff Output
        </label>
        <CopyButton value={copyValue} onCopied={onToast} disabled={!hasCompared} />
      </div>

      <div
        id="diffOutput"
        className={`${ui.codePreview} min-h-[280px] bg-[color-mix(in_srgb,var(--surface)_94%,var(--bg))]`}
      >
        {hasCompared ? (
          <DiffViewer
            oldValue={leftText}
            newValue={rightText}
            splitView
            showDiffOnly={false}
            leftTitle={leftFileName || "Original"}
            rightTitle={rightFileName || "Modified"}
          />
        ) : (
          <p className={ui.emptyMeta}>Run compare to see highlighted diff output.</p>
        )}
      </div>
    </section>
  );
}
