import type { ToolItem } from "./types";

export const APP_NAME = "Code Alchemy";
export const APP_VERSION = "v1.0.0";

export const tools: ToolItem[] = [
  { key: "guid", label: "GUID Generator", icon: "tabler:fingerprint" },
  { key: "base64", label: "Base64 Converter", icon: "tabler:file-code-2" },
  { key: "formatter", label: "Code Formatter", icon: "tabler:brackets-angle" },
  {
    key: "markdown-editor",
    label: "Markdown Editor",
    icon: "tabler:markdown",
  },
  { key: "qr", label: "QR Generator", icon: "tabler:qrcode" },
  { key: "minifier", label: "Code Minifier", icon: "tabler:arrows-minimize" },
  { key: "password", label: "Password Generator", icon: "tabler:key" },
  { key: "image-resizer", label: "Image Resizer", icon: "tabler:dimensions" },
  {
    key: "image-compressor",
    label: "Image Compressor",
    icon: "tabler:photo-down",
  },
];
