import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { ui } from "../uiClasses";

type ImageCompressorToolProps = {};

type OutputFormat = "image/jpeg" | "image/webp" | "image/png";

type ImageInfo = {
  width: number;
  height: number;
  bytes: number;
  format: string;
  name: string;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function ImageCompressorTool(_: ImageCompressorToolProps) {
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [sourceInfo, setSourceInfo] = useState<ImageInfo | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputInfo, setOutputInfo] = useState<ImageInfo | null>(null);
  const [errorText, setErrorText] = useState("");
  const hasSource = Boolean(sourceInfo);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const compressionRatio = useMemo(() => {
    if (!sourceInfo || !outputInfo || sourceInfo.bytes === 0) return null;
    return Math.max(
      0,
      ((sourceInfo.bytes - outputInfo.bytes) / sourceInfo.bytes) * 100,
    );
  }, [sourceInfo, outputInfo]);

  const onFilePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read image"));
        reader.readAsDataURL(file);
      });

      const bitmap = await createImageBitmap(file);
      setSourceDataUrl(dataUrl);
      setSourceInfo({
        width: bitmap.width,
        height: bitmap.height,
        bytes: file.size,
        format: file.type || "image/*",
        name: file.name,
      });
      setErrorText("");
    } catch {
      setErrorText("Unable to load this image.");
    }
  };

  const compressImage = async () => {
    if (!sourceDataUrl || !sourceInfo) {
      setErrorText("Upload an image first.");
      return;
    }

    const image = new Image();
    image.src = sourceDataUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to decode source image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = sourceInfo.width;
    canvas.height = sourceInfo.height;

    const context = canvas.getContext("2d");
    if (!context) {
      setErrorText("Canvas is not available in this browser.");
      return;
    }

    context.drawImage(image, 0, 0, sourceInfo.width, sourceInfo.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (nextBlob) => resolve(nextBlob),
        format,
        Math.min(1, Math.max(0.1, quality / 100)),
      );
    });

    if (!blob) {
      setErrorText("Unable to compress this image.");
      return;
    }

    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    const nextUrl = URL.createObjectURL(blob);
    setOutputUrl(nextUrl);
    setOutputInfo({
      width: sourceInfo.width,
      height: sourceInfo.height,
      bytes: blob.size,
      format,
    });
    setErrorText("");
  };

  const downloadCompressed = () => {
    if (!outputUrl || !outputInfo) return;

    const extension =
      outputInfo.format === "image/webp"
        ? "webp"
        : outputInfo.format === "image/png"
          ? "png"
          : "jpg";
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = `code-alchemy-compressed.${extension}`;
    link.click();
  };

  return (
    <section
      className={`${ui.toolCard} h-full animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Image Compressor</h2>
        <p className={ui.toolDescription}>
          Compress images and inspect output file details.
        </p>
      </header>

      <div className={ui.uploadInline}>
        <label className={ui.button} htmlFor="compressImageInput">
          <Icon icon="tabler:upload" width="16" />
          Upload
        </label>
        <p className={ui.fileMeta}>
          {sourceInfo ? sourceInfo.name : "No image selected"}
        </p>
        <input
          id="compressImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void onFilePicked(event)}
        />
      </div>

      {hasSource ? (
        <>
          <div className="grid grid-cols-1 items-end gap-2 md:grid-cols-3">
            <div className={ui.optionCard}>
              <label className={ui.fieldLabel} htmlFor="compressFormat">
                Output format
              </label>
              <select
                id="compressFormat"
                className={ui.compactInput}
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as OutputFormat)
                }
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            <div className={ui.optionCard}>
              <label className={ui.fieldLabel} htmlFor="compressQuality">
                Quality ({quality}%)
              </label>
              <input
                id="compressQuality"
                type="range"
                min={10}
                max={100}
                value={quality}
                className={ui.rangeInput}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
            </div>
          </div>

          <div className={ui.toolActions}>
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={() => void compressImage()}
            >
              <Icon icon="tabler:photo-down" width="16" />
              Compress
            </button>
            <button
              type="button"
              className={ui.button}
              onClick={downloadCompressed}
              disabled={!outputUrl}
            >
              <Icon icon="tabler:download" width="16" />
              Download
            </button>
          </div>
        </>
      ) : null}

      {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-[220px] flex-col gap-2 rounded-xl border border-[var(--border)] p-3">
          <p className={ui.fieldLabel}>Original</p>
          {sourceDataUrl ? (
            <img
              src={sourceDataUrl}
              alt="Original upload"
              className="max-h-[280px] w-full rounded-lg bg-[color-mix(in_srgb,var(--surface)_90%,var(--bg))] object-contain"
            />
          ) : (
            <p className={ui.emptyMeta}>Upload an image to preview.</p>
          )}
        </div>

        <div className="flex min-h-[220px] flex-col gap-2 rounded-xl border border-[var(--border)] p-3">
          <p className={ui.fieldLabel}>Compressed</p>
          {outputUrl ? (
            <img
              src={outputUrl}
              alt="Compressed output"
              className="max-h-[280px] w-full rounded-lg bg-[color-mix(in_srgb,var(--surface)_90%,var(--bg))] object-contain"
            />
          ) : (
            <p className={ui.emptyMeta}>Compressed image appears here.</p>
          )}
        </div>
      </div>

      {sourceInfo && outputInfo ? (
        <div className="grid gap-1 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--bg))] p-3">
          <p className={ui.fileMeta}>
            Input: {sourceInfo.width}x{sourceInfo.height} •{" "}
            {formatBytes(sourceInfo.bytes)} • {sourceInfo.format}
          </p>
          <p className={ui.fileMeta}>
            Output: {outputInfo.width}x{outputInfo.height} •{" "}
            {formatBytes(outputInfo.bytes)} • {outputInfo.format}
          </p>
          <p className={ui.fileMeta}>
            Saved:{" "}
            {compressionRatio !== null
              ? `${compressionRatio.toFixed(1)}%`
              : "-"}
          </p>
        </div>
      ) : null}
    </section>
  );
}
