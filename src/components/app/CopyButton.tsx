import { Icon } from "@iconify/react";
import { useState } from "react";
import { ui } from "./uiClasses";

type CopyButtonProps = {
  value: string;
  onCopied: () => void;
  disabled?: boolean;
  idleLabel?: string;
};

export default function CopyButton({
  value,
  onCopied,
  disabled = false,
  idleLabel = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    if (!value || disabled) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied();
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      className={`${ui.button} ${copied ? "bg-[color-mix(in_srgb,var(--accent)_26%,var(--surface))]" : ""}`}
      onClick={() => {
        void copyValue();
      }}
      disabled={disabled || !value}
    >
      <Icon icon={copied ? "tabler:check" : "tabler:copy"} width="16" />
      {copied ? "Copied" : idleLabel}
    </button>
  );
}
