import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME, tools } from "./constants";
import type { ToolKey } from "./types";

type SidebarProps = {
  activeTool: ToolKey;
  searchValue: string;
  isTyping: boolean;
  isCollapsed: boolean;
  onToolChange: (tool: ToolKey) => void;
  onSearchChange: (value: string) => void;
  onOpenSettings: () => void;
  onCollapsedChange: (collapsed: boolean) => void;
};

type IndicatorStyle = {
  top: number;
  height: number;
};

export default function Sidebar({
  activeTool,
  searchValue,
  isTyping,
  isCollapsed,
  onToolChange,
  onSearchChange,
  onOpenSettings,
  onCollapsedChange,
}: SidebarProps) {
  const asideRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Partial<Record<ToolKey, HTMLButtonElement | null>>>(
    {},
  );
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const filteredTools = useMemo(
    () =>
      tools.filter((tool) =>
        tool.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  const updateIndicatorStyle = useCallback(() => {
    const activeToolVisible = filteredTools.some(
      (tool) => tool.key === activeTool,
    );
    if (!activeToolVisible) {
      setIndicatorStyle(null);
      return;
    }

    const target = itemRefs.current[activeTool];
    const container = sidebarRef.current;
    if (!target || !container) {
      setIndicatorStyle(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicatorStyle({
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    });
  }, [activeTool, filteredTools]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 920px)");

    const syncMode = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setMobileToolsOpen(false);
      }
    };

    syncMode();
    mediaQuery.addEventListener("change", syncMode);

    return () => mediaQuery.removeEventListener("change", syncMode);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileToolsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !mobileToolsOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const sidebar = asideRef.current;
      if (!sidebar) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !sidebar.contains(target)) {
        setMobileToolsOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const sidebar = asideRef.current;
      if (!sidebar) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !sidebar.contains(target)) {
        setMobileToolsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isMobile, mobileToolsOpen]);

  useEffect(() => {
    updateIndicatorStyle();

    const frameId = window.requestAnimationFrame(updateIndicatorStyle);
    const timeoutId = window.setTimeout(updateIndicatorStyle, 260);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [updateIndicatorStyle, isCollapsed, isMobile, mobileToolsOpen]);

  useEffect(() => {
    const handleResize = () => updateIndicatorStyle();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicatorStyle]);

  const handleSearchFocus = () => {
    if (isMobile) {
      setMobileToolsOpen(true);
      return;
    }

    if (isCollapsed) {
      onCollapsedChange(false);
      window.setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileToolsOpen((value) => !value);
      return;
    }

    onCollapsedChange(!isCollapsed);
  };

  const showToolsList = !isMobile || mobileToolsOpen;
  const isDesktopCollapsed = isCollapsed && !isMobile;

  return (
    <aside
      ref={asideRef}
      className={`relative z-[5] flex flex-col gap-4 overflow-visible border-r border-[var(--border)] bg-[var(--sidebar)] p-[1.1rem_1rem] max-[920px]:h-fit max-[920px]:self-start max-[920px]:gap-2 max-[920px]:border-r-0 max-[920px]:border-b max-[920px]:p-[0.55rem_0.65rem]`}
    >
      <div className="flex flex-col gap-3 max-[920px]:relative max-[920px]:z-[11] max-[920px]:flex-row max-[920px]:items-center max-[920px]:gap-2">
        <header
          className={`mb-1 flex items-center gap-2.5 ${isDesktopCollapsed ? "justify-center min-h-8" : ""} max-[920px]:mb-0 max-[920px]:min-w-max`}
        >
          {isDesktopCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="group relative inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface))] text-[var(--accent)]"
            >
              <span className="inline-flex items-center justify-center group-hover:hidden">
                <Icon icon="tabler:flask-2" width="18" />
              </span>
              <span className="hidden items-center justify-center text-[var(--muted)] group-hover:inline-flex">
                <Icon icon="tabler:layout-sidebar-left-expand" width="16" />
              </span>
            </button>
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface))] text-[var(--accent)]">
              <Icon icon="tabler:flask-2" width="18" />
            </div>
          )}
          {!isDesktopCollapsed ? (
            <h1 className="m-0 bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_50%,var(--surface))] bg-clip-text font-[Cinzel] text-[1.24rem] font-bold tracking-wide text-transparent">
              {APP_NAME}
            </h1>
          ) : null}

          {!isDesktopCollapsed ? (
            <button
              type="button"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] hover:text-[var(--accent)] max-[920px]:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon
                icon={
                  isMobile
                    ? mobileToolsOpen
                      ? "tabler:layout-sidebar-right-collapse"
                      : "tabler:layout-sidebar-right-expand"
                    : isCollapsed
                      ? "tabler:layout-sidebar-left-expand"
                      : "tabler:layout-sidebar-left-collapse"
                }
                width="16"
              />
            </button>
          ) : null}
        </header>

        <div
          className={`relative flex items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--accent)_26%,transparent)] ${isTyping ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:animate-[typing-wave_800ms_linear_infinite] after:bg-gradient-to-r after:from-transparent after:via-[var(--accent)] after:to-transparent" : ""} ${isDesktopCollapsed ? "h-[2.9rem] w-full cursor-pointer justify-center rounded-xl border-[color-mix(in_srgb,var(--accent)_20%,var(--border))] bg-transparent p-0" : ""} max-[920px]:ml-1 max-[920px]:mr-1 max-[920px]:min-w-0 max-[920px]:flex-1`}
          onClick={handleSearchFocus}
          title={isDesktopCollapsed ? "Search tools" : undefined}
        >
          <Icon
            icon="tabler:search"
            width={isDesktopCollapsed ? "22" : "16"}
            className={`shrink-0 text-[var(--muted)] ${isDesktopCollapsed ? "pointer-events-none absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 text-[var(--accent)]" : "ml-3"}`}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onKeyDown={(event) => {
              if (event.key !== "Escape") {
                return;
              }

              onSearchChange("");
              if (isMobile) {
                setMobileToolsOpen(false);
              }
            }}
            onFocus={handleSearchFocus}
            onBlur={(event) => {
              if (!isMobile) {
                return;
              }

              const nextTarget = event.relatedTarget;
              if (
                nextTarget instanceof Node &&
                asideRef.current?.contains(nextTarget)
              ) {
                return;
              }

              window.setTimeout(() => {
                const activeElement = document.activeElement;
                if (
                  activeElement instanceof Node &&
                  asideRef.current?.contains(activeElement)
                ) {
                  return;
                }
                setMobileToolsOpen(false);
              }, 0);
            }}
            onChange={(event) => {
              if (isMobile) {
                setMobileToolsOpen(true);
              }
              onSearchChange(event.target.value);
            }}
            placeholder="Search tools"
            aria-label="Search tools"
            className={`w-full border-0 bg-transparent py-3 pr-3 pl-2 font-medium text-[color-mix(in_srgb,var(--accent)_34%,var(--muted))] outline-none placeholder:text-[var(--muted)] ${isDesktopCollapsed ? "pointer-events-none absolute h-0 w-0 p-0 opacity-0" : ""}`}
          />
        </div>
      </div>

      {showToolsList ? (
        <div
          className={`flex min-h-0 flex-1 flex-col gap-3 ${
            isMobile
              ? `absolute left-[0.65rem] right-[0.65rem] top-[calc(100%+0.3rem)] z-[12] max-h-[calc(100dvh-4.4rem)] min-h-[calc(100dvh-4.8rem)] rounded-2xl border border-[var(--border)] bg-[var(--sidebar)] p-2 shadow-[0_18px_28px_color-mix(in_srgb,var(--accent)_12%,transparent)] ${mobileToolsOpen ? "flex" : "hidden"}`
              : ""
          }`}
        >
          <div
            className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-1"
            ref={sidebarRef}
          >
            {indicatorStyle ? (
              <div
                className={`pointer-events-none absolute rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_22%,var(--surface))] transition-all duration-200 ${isDesktopCollapsed ? "left-[0.2rem] right-[0.2rem]" : "left-0 right-0"}`}
                style={{
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                }}
              />
            ) : null}

            {filteredTools.map((tool) => (
              <button
                key={tool.key}
                type="button"
                ref={(node) => {
                  itemRefs.current[tool.key] = node;
                }}
                className={`group relative flex items-center gap-2 overflow-visible rounded-xl border border-transparent bg-transparent px-3 py-3 text-left font-semibold text-[color-mix(in_srgb,var(--accent)_28%,var(--muted))] transition-all duration-200 ease-out active:scale-[0.97] ${
                  activeTool === tool.key
                    ? "scale-[1.03] text-[var(--accent)] brightness-105"
                    : "hover:border-[color-mix(in_srgb,var(--accent)_18%,transparent)] hover:text-[var(--accent)] hover:brightness-100 hover:shadow-[0_12px_21px_-10px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
                } ${isDesktopCollapsed ? "justify-center" : ""}`}
                onClick={() => {
                  onToolChange(tool.key);
                  if (isMobile) {
                    setMobileToolsOpen(false);
                  }
                }}
                title={isDesktopCollapsed ? tool.label : undefined}
              >
                <span className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-[var(--accent)] transition-all duration-200 ease-out group-hover:min-h-2/4" />
                <span className="inline-flex transition-transform duration-200 ease-out group-hover:rotate-[5deg] group-hover:scale-110">
                  <Icon icon={tool.icon} width="18" />
                </span>
                {!isDesktopCollapsed ? (
                  <span className="transition-all duration-200 ease-out group-hover:translate-x-1.5 group-hover:font-bold">
                    {tool.label}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`mt-auto flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 font-semibold text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))] transition hover:text-[var(--accent)] ${isDesktopCollapsed ? "justify-center" : ""}`}
            onClick={onOpenSettings}
            title={isDesktopCollapsed ? "Settings" : undefined}
          >
            <Icon icon="tabler:settings" width="18" />
            {!isDesktopCollapsed ? "Settings" : null}
          </button>
        </div>
      ) : null}
    </aside>
  );
}
