import { Icon } from "@iconify/react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import SettingsModal from "./app/SettingsModal";
import Sidebar from "./app/Sidebar";
import ToolSkeleton from "./app/ToolSkeleton";
import Base64Tool from "./app/tools/Base64Tool";
import GuidTool from "./app/tools/GuidTool";
import type { ThemeMode, ToastState, ToolKey } from "./app/types";
import { ui } from "./app/uiClasses";

const CodeFormatterTool = lazy(() => import("./app/tools/CodeFormatterTool"));
const MarkdownEditorTool = lazy(() => import("./app/tools/MarkdownEditorTool"));
const QrGeneratorTool = lazy(() => import("./app/tools/QrGeneratorTool"));
const MinifierTool = lazy(() => import("./app/tools/MinifierTool"));
const PasswordGeneratorTool = lazy(
  () => import("./app/tools/PasswordGeneratorTool"),
);
const ImageResizerTool = lazy(() => import("./app/tools/ImageResizerTool"));
const ImageCompressorTool = lazy(
  () => import("./app/tools/ImageCompressorTool"),
);

export default function CodeAlchemyApp() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeTool, setActiveTool] = useState<ToolKey>("guid");
  const [displayedTool, setDisplayedTool] = useState<ToolKey>("guid");
  const [isSwitchingTool, setIsSwitchingTool] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const switchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("code-alchemy-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("code-alchemy-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isTyping) return;
    const stopTyping = window.setTimeout(() => setIsTyping(false), 500);
    return () => window.clearTimeout(stopTyping);
  }, [searchValue, isTyping]);

  useEffect(() => {
    if (!toast) return;
    const toastTimer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(toastTimer);
  }, [toast]);

  const handleToolChange = (tool: ToolKey) => {
    if (tool === activeTool || tool === displayedTool) {
      return;
    }

    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
    }

    setActiveTool(tool);
    setIsSwitchingTool(true);
    switchTimerRef.current = window.setTimeout(() => {
      setDisplayedTool(tool);
      setIsSwitchingTool(false);
    }, 240);
  };

  useEffect(
    () => () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current);
      }
    },
    [],
  );

  const showCopyToast = () => {
    setToast({ id: Date.now(), text: "Copied to clipboard" });
  };

  return (
    <main
      className={`${ui.shell} ${isSidebarCollapsed ? ui.shellCollapsed : ui.shellExpanded}`}
    >
      <Sidebar
        activeTool={activeTool}
        searchValue={searchValue}
        isTyping={isTyping}
        isCollapsed={isSidebarCollapsed}
        onToolChange={handleToolChange}
        onSearchChange={(value) => {
          setSearchValue(value);
          setIsTyping(true);
        }}
        onOpenSettings={() => setShowSettings(true)}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      <section className={ui.contentPanel}>
        <div
          className={`${ui.contentSwitch} ${isSwitchingTool ? "" : "animate-[content-in_260ms_ease-out]"}`}
        >
          {isSwitchingTool ? <ToolSkeleton /> : null}
          {!isSwitchingTool && displayedTool === "guid" ? (
            <GuidTool onToast={showCopyToast} />
          ) : null}
          {!isSwitchingTool && displayedTool === "base64" ? (
            <Base64Tool onToast={showCopyToast} />
          ) : null}
          {!isSwitchingTool && displayedTool === "formatter" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <CodeFormatterTool theme={theme} onToast={showCopyToast} />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "markdown-editor" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <MarkdownEditorTool theme={theme} />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "qr" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <QrGeneratorTool onToast={showCopyToast} />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "minifier" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <MinifierTool theme={theme} onToast={showCopyToast} />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "password" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <PasswordGeneratorTool onToast={showCopyToast} />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "image-resizer" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <ImageResizerTool />
            </Suspense>
          ) : null}
          {!isSwitchingTool && displayedTool === "image-compressor" ? (
            <Suspense fallback={<ToolSkeleton />}>
              <ImageCompressorTool />
            </Suspense>
          ) : null}
        </div>
      </section>

      {showSettings ? (
        <SettingsModal
          theme={theme}
          onClose={() => setShowSettings(false)}
          onToggleTheme={() =>
            setTheme((value) => (value === "dark" ? "light" : "dark"))
          }
        />
      ) : null}

      {toast ? (
        <div
          key={toast.id}
          className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface))] px-3 py-2 text-[color-mix(in_srgb,var(--accent)_70%,var(--muted))]"
        >
          <Icon icon="tabler:check" width="16" />
          {toast.text}
        </div>
      ) : null}
    </main>
  );
}
