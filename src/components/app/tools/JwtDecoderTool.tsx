import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type JwtDecoderToolProps = {
  onToast: () => void;
};

const safeJson = (value: unknown) => JSON.stringify(value, null, 2);

export default function JwtDecoderTool({ onToast }: JwtDecoderToolProps) {
  const [token, setToken] = useState("");
  const [decodedValue, setDecodedValue] = useState("");

  const decodeToken = () => {
    if (!token.trim()) {
      setDecodedValue("");
      return;
    }

    try {
      const header = jwtDecode(token, { header: true });
      const payload = jwtDecode(token);
      const combined = {
        header,
        payload,
      };

      setDecodedValue(safeJson(combined));
    } catch {
      setDecodedValue("Invalid JWT token.");
    }
  };

  return (
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>JWT Decoder</h2>
        <p className={ui.toolDescription}>
          Decode JWT header and payload without verification.
        </p>
      </header>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="jwtInput">
              JWT Token
            </label>
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={decodeToken}
            >
              <Icon icon="tabler:key" width="16" />
              Decode
            </button>
          </div>

          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="jwtInput"
              className={ui.textArea}
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste JWT token"
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="jwtOutput">
              Decoded Output
            </label>
            <CopyButton
              value={decodedValue}
              onCopied={onToast}
              disabled={!decodedValue}
            />
          </div>

          <div className={`${ui.textAreaFrame} min-h-[300px] flex-1`}>
            <textarea
              id="jwtOutput"
              className={ui.textArea}
              value={decodedValue}
              readOnly
              placeholder="Decoded JWT appears here"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
