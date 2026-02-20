import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import type { ThemeMode } from "../types";
import { ui } from "../uiClasses";

type MarkdownEditorToolProps = {
  theme: ThemeMode;
};

export default function MarkdownEditorTool({ theme }: MarkdownEditorToolProps) {
  const [sourceMarkdown, setSourceMarkdown] = useState("");

  return (
    <section
      className={`${ui.toolCard} h-full animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Markdown Editor</h2>
        <p className={ui.toolDescription}>Edit markdown with live preview.</p>
      </header>

      <div
        className="h-full flex-1 overflow-hidden rounded-xl border border-(--border) not-prose"
        data-color-mode={theme}
      >
        <MDEditor
          className="!h-full"
          value={sourceMarkdown}
          onChange={(value) => setSourceMarkdown(value ?? "")}
          preview="live"
          hideToolbar={false}
          visibleDragbar={false}
          height={480}
        />
      </div>
    </section>
  );
}
