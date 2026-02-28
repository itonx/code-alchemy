import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type UrlEncoderDecoderToolProps = {
  onToast: () => void;
};

export default function UrlEncoderDecoderTool({
  onToast,
}: UrlEncoderDecoderToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const encodeUrl = () => {
    setOutputValue(encodeURIComponent(inputValue));
  };

  const decodeUrl = () => {
    try {
      setOutputValue(decodeURIComponent(inputValue));
    } catch {
      setOutputValue(inputValue);
    }
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>URL Encoder / Decoder</h2>
        <p className={ui.toolDescription}>
          Encode or decode URL-safe content quickly.
        </p>
      </header>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-2">
            <label className={ui.fieldLabel} htmlFor="urlInput">
              Input
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`${ui.button} ${ui.buttonPrimary}`}
                onClick={encodeUrl}
              >
                <Icon icon="tabler:link" width="16" />
                Encode
              </button>
              <button type="button" className={ui.button} onClick={decodeUrl}>
                <Icon icon="tabler:link-off" width="16" />
                Decode
              </button>
            </div>
          </div>

          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="urlInput"
              className={ui.textArea}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type URL or encoded text"
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="urlOutput">
              Output
            </label>
            <CopyButton
              value={outputValue}
              onCopied={onToast}
              disabled={!outputValue}
            />
          </div>

          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="urlOutput"
              className={ui.textArea}
              value={outputValue}
              readOnly
              placeholder="Encoded/decoded output appears here"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
