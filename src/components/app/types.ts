export type ThemeMode = "dark" | "light";
export type ToolKey =
  | "guid"
  | "base64"
  | "formatter"
  | "aes"
  | "text-diff"
  | "color-picker"
  | "number-base"
  | "timezone-converter"
  | "hash"
  | "random-number"
  | "color-palette"
  | "lorem-ipsum"
  | "url-encoder"
  | "jwt-decoder"
  | "http-status"
  | "markdown-editor"
  | "qr"
  | "minifier"
  | "password"
  | "image-resizer"
  | "image-compressor";

export type ToastState = {
  id: number;
  text: string;
};

export type ToolItem = {
  key: ToolKey;
  label: string;
  icon: string;
  description: string;
};
