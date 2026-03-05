import { Icon } from "@iconify/react";
import { fileTypeFromBuffer } from "file-type";
import { useEffect, useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";
import { fromBase64ToBytes, fromTextToBase64, toBase64 } from "../utils/base64";

type Base64ToolProps = {
  onToast: () => void;
};

export default function Base64Tool({ onToast }: Base64ToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errorText, setErrorText] = useState("");
  const [decodedFile, setDecodedFile] = useState<{
    url: string;
    name: string;
    size: number;
    mime: string;
    isPdf: boolean;
  } | null>(null);

  const clearDecodedFile = () => {
    setDecodedFile((previousValue) => {
      if (previousValue) {
        URL.revokeObjectURL(previousValue.url);
      }
      return null;
    });
  };

  const resetOutputs = () => {
    setResultValue("");
    setSelectedFileName("");
    setErrorText("");
    clearDecodedFile();
  };

  const isLikelyTextBytes = (bytes: Uint8Array) => {
    if (!bytes.length) return true;

    const sample = bytes.subarray(0, 4096);
    let controlCount = 0;
    for (const byteValue of sample) {
      if (byteValue === 9 || byteValue === 10 || byteValue === 13) continue;
      if (byteValue < 32 || byteValue === 127) {
        controlCount += 1;
      }
    }

    return controlCount / sample.length < 0.02;
  };

  useEffect(() => {
    return () => {
      clearDecodedFile();
    };
  }, []);

  const encodeText = () => {
    resetOutputs();
    setResultValue(fromTextToBase64(inputValue));
  };

  const decodeText = async () => {
    resetOutputs();
    try {
      const decodedBytes = fromBase64ToBytes(inputValue);

      if (!isLikelyTextBytes(decodedBytes)) {
        const detectedType = await fileTypeFromBuffer(
          decodedBytes.subarray(0, 8192),
        );
        const extension = detectedType?.ext ?? "bin";
        const mime = detectedType?.mime ?? "application/octet-stream";
        const decodedBlob = new Blob([decodedBytes], {
          type: mime,
        });
        setDecodedFile({
          url: URL.createObjectURL(decodedBlob),
          name: `decoded-file.${extension}`,
          size: decodedBlob.size,
          mime,
          isPdf: mime === "application/pdf" || extension === "pdf",
        });
        return;
      }

      const decoded = new TextDecoder().decode(decodedBytes);
      setResultValue(decoded);
    } catch {
      clearDecodedFile();
      setErrorText("Invalid Base64 input.");
    }
  };

  const handleFileEncode = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    resetOutputs();
    const targetFile = event.target.files?.[0];
    if (!targetFile) return;

    const fileBuffer = await targetFile.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    setResultValue(toBase64(fileBytes));
    setSelectedFileName(targetFile.name);
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Base64 Converter</h2>
        <p className={ui.toolDescription}>
          Encode/decode text and encode files with Base64.
        </p>
      </header>

      <label className={ui.fieldLabel} htmlFor="base64Input">
        Input
      </label>
      <div className={ui.textAreaFrame}>
        <textarea
          id="base64Input"
          className={ui.textArea}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Type text or Base64 data"
        />
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={encodeText}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-export" width="16" />
          Encode Text
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={() => {
            void decodeText();
          }}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-import" width="16" />
          Decode Base64
        </button>
        <label className={ui.button} htmlFor="fileConvertInput">
          <Icon icon="tabler:upload" width="16" />
          Encode File
        </label>
        <input
          id="fileConvertInput"
          type="file"
          className="hidden"
          onChange={(event) => void handleFileEncode(event)}
        />
      </div>

      {selectedFileName ? (
        <p className={ui.fileMeta}>Encoded file: {selectedFileName}</p>
      ) : null}
      {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="base64Output">
          Output
        </label>
        {decodedFile ? (
          <a
            href={decodedFile.url}
            download={decodedFile.name}
            className={ui.button}
          >
            <Icon icon="tabler:download" width="16" />
            Download File
          </a>
        ) : (
          <CopyButton
            value={resultValue}
            onCopied={onToast}
            disabled={!resultValue}
          />
        )}
      </div>
      {decodedFile ? (
        <div className={ui.textAreaFrame}>
          <div className="p-3 text-sm text-(--muted)">
            Decoded file is ready ({decodedFile.size.toLocaleString()} bytes).
          </div>
        </div>
      ) : (
        <div className={ui.textAreaFrame}>
          <textarea
            id="base64Output"
            className={ui.textArea}
            value={resultValue}
            readOnly
            placeholder="Converted output appears here"
          />
        </div>
      )}
      {decodedFile?.isPdf ? (
        <div className={ui.textAreaFrame}>
          <iframe
            src={decodedFile.url}
            title="Decoded PDF preview"
            className="h-130 w-full border-0"
          />
        </div>
      ) : null}
    </section>
  );
}
