import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import NumberInput from "../NumberInput";
import { ui } from "../uiClasses";

type ImageResizerToolProps = {};

type ImageMeta = {
  width: number;
  height: number;
  sizeKB: number;
  name: string;
};

const formatKB = (size: number) => `${(size / 1024).toFixed(1)} KB`;

export default function ImageResizerTool(_: ImageResizerToolProps) {
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [sourceMeta, setSourceMeta] = useState<ImageMeta | null>(null);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputMeta, setOutputMeta] = useState<ImageMeta | null>(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  const readImageFile = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read image file"));
      reader.readAsDataURL(file);
    });

    const bitmap = await createImageBitmap(file);

    setSourceDataUrl(dataUrl);
    setSourceMeta({
      width: bitmap.width,
      height: bitmap.height,
      sizeKB: file.size / 1024,
      name: file.name,
    });
    setTargetWidth(bitmap.width);
    setTargetHeight(bitmap.height);
    setErrorText("");
  };

  const onImagePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await readImageFile(file);
    } catch {
      setErrorText("Unable to load this image.");
    }
  };

  const resizeImage = async () => {
    if (!sourceDataUrl || !sourceMeta) {
      setErrorText("Upload an image first.");
      return;
    }

    const safeWidth = Math.max(1, Math.trunc(targetWidth));
    const safeHeight = Math.max(1, Math.trunc(targetHeight));

    const image = new Image();
    image.src = sourceDataUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to decode source image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = safeWidth;
    canvas.height = safeHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setErrorText("Canvas is not available in this browser.");
      return;
    }

    context.drawImage(image, 0, 0, safeWidth, safeHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
    });

    if (!blob) {
      setErrorText("Unable to create resized image.");
      return;
    }

    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    const nextUrl = URL.createObjectURL(blob);
    setOutputUrl(nextUrl);
    setOutputMeta({
      width: safeWidth,
      height: safeHeight,
      sizeKB: blob.size / 1024,
      name: sourceMeta.name,
    });
    setErrorText("");
  };

  const onWidthChange = (value: number) => {
    setTargetWidth(value);
    if (keepAspectRatio && sourceMeta) {
      const nextHeight = Math.max(
        1,
        Math.round((value / sourceMeta.width) * sourceMeta.height),
      );
      setTargetHeight(nextHeight);
    }
  };

  const onHeightChange = (value: number) => {
    setTargetHeight(value);
    if (keepAspectRatio && sourceMeta) {
      const nextWidth = Math.max(
        1,
        Math.round((value / sourceMeta.height) * sourceMeta.width),
      );
      setTargetWidth(nextWidth);
    }
  };

  const downloadResized = () => {
    if (!outputUrl) return;
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "code-alchemy-resized.png";
    link.click();
  };

  return (
    <section
      className={`${ui.toolCard} h-full animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Image Resizer</h2>
        <p className={ui.toolDescription}>
          Resize image dimensions with optional aspect ratio lock.
        </p>
      </header>

      <div className={ui.uploadInline}>
        <label className={ui.button} htmlFor="resizeImageInput">
          <Icon icon="tabler:upload" width="16" />
          Upload
        </label>
        <p className={ui.fileMeta}>
          {sourceMeta ? sourceMeta.name : "No image selected"}
        </p>
        <input
          id="resizeImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void onImagePicked(event)}
        />
      </div>

      <div className="grid grid-cols-1 items-end gap-2 md:grid-cols-3">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="resizeWidth">
            Width
          </label>
          <NumberInput
            id="resizeWidth"
            min={1}
            value={targetWidth || 1}
            defaultValue={1}
            onChange={onWidthChange}
            disabled={!sourceMeta}
            ariaLabel="image width"
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="resizeHeight">
            Height
          </label>
          <NumberInput
            id="resizeHeight"
            min={1}
            value={targetHeight || 1}
            defaultValue={1}
            onChange={onHeightChange}
            disabled={!sourceMeta}
            ariaLabel="image height"
          />
        </div>

        <label className="inline-flex h-10 w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] px-3 text-sm text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))]">
          <input
            type="checkbox"
            checked={keepAspectRatio}
            onChange={(event) => setKeepAspectRatio(event.target.checked)}
          />
          Keep aspect ratio
        </label>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={() => void resizeImage()}
        >
          <Icon icon="tabler:dimensions" width="16" />
          Resize Image
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={downloadResized}
          disabled={!outputUrl}
        >
          <Icon icon="tabler:download" width="16" />
          Download
        </button>
      </div>

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
          {sourceMeta ? (
            <p className={ui.fileMeta}>
              {sourceMeta.width}x{sourceMeta.height} •{" "}
              {formatKB(sourceMeta.sizeKB * 1024)}
            </p>
          ) : null}
        </div>

        <div className="flex min-h-[220px] flex-col gap-2 rounded-xl border border-[var(--border)] p-3">
          <p className={ui.fieldLabel}>Resized</p>
          {outputUrl ? (
            <img
              src={outputUrl}
              alt="Resized output"
              className="max-h-[280px] w-full rounded-lg bg-[color-mix(in_srgb,var(--surface)_90%,var(--bg))] object-contain"
            />
          ) : (
            <p className={ui.emptyMeta}>Resized image appears here.</p>
          )}
          {outputMeta ? (
            <p className={ui.fileMeta}>
              {outputMeta.width}x{outputMeta.height} •{" "}
              {formatKB(outputMeta.sizeKB * 1024)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
