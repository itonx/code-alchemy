import { Icon } from "@iconify/react";
import CryptoJS from "crypto-js";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type AesToolProps = {
  onToast: () => void;
};

export default function AesTool({ onToast }: AesToolProps) {
  const [secret, setSecret] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const encrypt = () => {
    if (!secret.trim() || !inputValue) {
      setOutputValue("");
      return;
    }

    const encrypted = CryptoJS.AES.encrypt(inputValue, secret).toString();
    setOutputValue(encrypted);
  };

  const decrypt = () => {
    if (!secret.trim() || !inputValue) {
      setOutputValue("");
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(inputValue, secret).toString(
        CryptoJS.enc.Utf8,
      );
      setOutputValue(decrypted || "Invalid encrypted input or secret key.");
    } catch {
      setOutputValue("Invalid encrypted input or secret key.");
    }
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>AES Encrypt / Decrypt</h2>
        <p className={ui.toolDescription}>
          Encrypt or decrypt text using AES and a secret key.
        </p>
      </header>

      <div className={ui.optionCard}>
        <label className={ui.fieldLabel} htmlFor="aesSecret">
          Secret Key
        </label>
        <input
          id="aesSecret"
          type="text"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          className={ui.compactInput}
          placeholder="Type secret key"
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-col gap-2">
        <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
          <label className={ui.fieldLabel} htmlFor="aesInput">
            Input
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={encrypt}
            >
              <Icon icon="tabler:lock" width="16" />
              Encrypt
            </button>
            <button type="button" className={ui.button} onClick={decrypt}>
              <Icon icon="tabler:lock-open" width="16" />
              Decrypt
            </button>
          </div>
        </div>

        <div className={`${ui.textAreaFrame} min-h-[220px]`}>
          <textarea
            id="aesInput"
            className={ui.textArea}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type plain or encrypted text"
          />
        </div>
      </div>

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="aesOutput">
          Output
        </label>
        <CopyButton
          value={outputValue}
          onCopied={onToast}
          disabled={!outputValue}
        />
      </div>

      <div className={`${ui.textAreaFrame} min-h-[220px]`}>
        <textarea
          id="aesOutput"
          className={ui.textArea}
          value={outputValue}
          readOnly
          placeholder="Result appears here"
        />
      </div>
    </section>
  );
}
