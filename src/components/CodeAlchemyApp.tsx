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
  const [hasScrollableToolContent, setHasScrollableToolContent] =
    useState(false);
  const [isToolContentScrolled, setIsToolContentScrolled] = useState(false);
  const switchTimerRef = useRef<number | null>(null);
  const contentPanelRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const panel = contentPanelRef.current;
    if (!panel) {
      return;
    }

    const updateScrollState = () => {
      const panelStyles = window.getComputedStyle(panel);
      const verticalPadding =
        Number.parseFloat(panelStyles.paddingTop) +
        Number.parseFloat(panelStyles.paddingBottom);
      const panelInnerHeight = Math.max(
        0,
        panel.clientHeight - verticalPadding,
      );
      panel.style.setProperty(
        "--content-panel-height",
        `${panelInnerHeight}px`,
      );
      const isScrollable = panel.scrollHeight - panel.clientHeight > 1;
      setHasScrollableToolContent(isScrollable);
      setIsToolContentScrolled(panel.scrollTop > 24);
    };

    updateScrollState();
    panel.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(panel);
    if (panel.firstElementChild) {
      observer.observe(panel.firstElementChild);
    }

    return () => {
      panel.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [displayedTool, isSwitchingTool, isSidebarCollapsed]);

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

      <section
        ref={contentPanelRef}
        className={`${ui.contentPanel} min-[921px]:col-[1/-1] ${isSidebarCollapsed ? "min-[921px]:ml-[92px]" : "min-[921px]:ml-[300px]"}`}
      >
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

      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        {hasScrollableToolContent && isToolContentScrolled ? (
          <button
            type="button"
            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_22%,var(--surface))] text-(--accent) transition hover:-translate-y-px hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
            title="Go to top"
            aria-label="Go to top"
            onClick={() =>
              contentPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <Icon icon="tabler:arrow-up" width="18" />
            <span className="pointer-events-none absolute right-[calc(100%+0.5rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs font-semibold text-(--muted) shadow-[0_10px_24px_color-mix(in_srgb,var(--bg)_35%,transparent)] group-hover:block">
              Go to top
            </span>
          </button>
        ) : null}

        <a
          href="https://buymeacoffee.com/itonx"
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_22%,var(--surface))] text-(--accent) transition hover:-translate-y-px hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
          title="Buy me a coffee"
          aria-label="Buy me a coffee"
        >
          <Icon icon="tabler:coffee" width="18" />
          <span className="pointer-events-none absolute right-[calc(100%+0.5rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs font-semibold text-(--muted) shadow-[0_10px_24px_color-mix(in_srgb,var(--bg)_35%,transparent)] group-hover:block">
            Buy me a coffee
          </span>
        </a>
      </div>
    </main>
  );
}
