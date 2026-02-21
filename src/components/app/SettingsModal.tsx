import { Icon } from "@iconify/react";
import { APP_NAME, APP_VERSION } from "./constants";
import type { ThemeMode } from "./types";
import { ui } from "./uiClasses";

type SettingsModalProps = {
  theme: ThemeMode;
  onClose: () => void;
  onToggleTheme: () => void;
};

export default function SettingsModal({
  theme,
  onClose,
  onToggleTheme,
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[color-mix(in_srgb,var(--bg)_55%,transparent)] backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-[min(92vw,480px)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-start mb-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface))] text-[var(--accent)]">
            <Icon icon="tabler:flask-2" width="18" />
          </div>
          <h2 className="ml-2 mt-0.5 bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_50%,var(--surface))] bg-clip-text font-[Cinzel] text-2xl font-bold tracking-wide text-transparent">
            {APP_NAME}
          </h2>
          <button
            type="button"
            className="ml-auto text-[var(--muted)]"
            onClick={onClose}
          >
            <Icon icon="tabler:x" width="18" />
          </button>
        </header>
        <p className="text-[var(--muted)]">Version: {APP_VERSION}</p>
        <div className="flex items-center justify-between gap-3">
          <span>Current Theme: {theme}</span>
          <button
            type="button"
            className={`${ui.button} ${ui.buttonPrimary} h-10 w-44 justify-center`}
            onClick={onToggleTheme}
          >
            <Icon
              icon={theme === "dark" ? "tabler:sun" : "tabler:moon"}
              width="16"
            />
            Switch Theme
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          <a
            href="https://buymeacoffee.com/itonx"
            target="_blank"
            rel="noreferrer"
            className={`${ui.button} ${ui.buttonPrimary} h-10 w-44 justify-center`}
          >
            <Icon icon="tabler:coffee" width="16" />
            Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  );
}
