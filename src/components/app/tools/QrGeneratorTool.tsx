import { Icon } from "@iconify/react";
import { useState } from "react";
import QRCode from "qrcode";
import { ui } from "../uiClasses";

type QrGeneratorToolProps = {
  onToast: () => void;
};

export default function QrGeneratorTool({ onToast }: QrGeneratorToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateQr = async () => {
    if (!inputValue.trim()) {
      setQrDataUrl("");
      setErrorText("Enter text or URL to generate a QR code.");
      return;
    }

    try {
      const url = await QRCode.toDataURL(inputValue, {
        width: 320,
        margin: 1,
      });
      setQrDataUrl(url);
      setErrorText("");
    } catch {
      setErrorText("Unable to generate QR code for this input.");
    }
  };

  const copyQrImage = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();

      if (navigator.clipboard && "ClipboardItem" in window) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        setCopied(true);
        onToast();
        window.setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      setErrorText("Unable to copy QR image.");
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "code-alchemy-qr.png";
    link.click();
  };

  return (
    <section
      className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>QR Generator</h2>
        <p className={ui.toolDescription}>
          Create QR images from text or links.
        </p>
      </header>

      <label className={ui.fieldLabel} htmlFor="qrInput">
        Text / URL
      </label>
      <div className={ui.textAreaFrame}>
        <textarea
          id="qrInput"
          className={ui.textArea}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Paste URL or text"
        />
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={() => void generateQr()}
        >
          <Icon icon="tabler:qrcode" width="16" />
          Generate QR
        </button>
      </div>

      {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel}>Output</label>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className={`${ui.button} ${copied ? "bg-[color-mix(in_srgb,var(--accent)_26%,var(--surface))]" : ""}`}
            onClick={() => {
              void copyQrImage();
            }}
            disabled={!qrDataUrl}
          >
            <Icon icon={copied ? "tabler:check" : "tabler:copy"} width="16" />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className={ui.button}
            onClick={downloadQr}
            disabled={!qrDataUrl}
          >
            <Icon icon="tabler:download" width="16" />
            Download
          </button>
        </div>
      </div>

      {qrDataUrl ? (
        <div className="grid min-h-[220px] place-items-center rounded-xl border border-dashed border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] p-3">
          <img
            src={qrDataUrl}
            alt="Generated QR code"
            className="h-auto w-full max-w-[320px] rounded-lg bg-white p-1.5"
          />
        </div>
      ) : (
        <p className={ui.emptyMeta}>QR preview appears here.</p>
      )}
    </section>
  );
}
