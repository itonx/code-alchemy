import type { ToolItem } from "./types";
import packageJson from "../../../package.json";

export const APP_NAME = "Code Alchemy";
export const APP_VERSION = `v${packageJson.version}`;

export const tools: ToolItem[] = [
  { key: "guid", label: "GUID Generator", icon: "tabler:fingerprint" },
  { key: "base64", label: "Base64 Converter", icon: "tabler:file-code-2" },
  { key: "formatter", label: "Code Formatter", icon: "tabler:brackets-angle" },
  { key: "hash", label: "Hash Generator", icon: "tabler:hash" },
  {
    key: "random-number",
    label: "Random Number Generator",
    icon: "tabler:dice-6",
  },
  {
    key: "color-palette",
    label: "Color Palette Generator",
    icon: "tabler:palette",
  },
  {
    key: "lorem-ipsum",
    label: "Lorem Ipsum Generator",
    icon: "tabler:file-text",
  },
  {
    key: "url-encoder",
    label: "URL Encoder / Decoder",
    icon: "tabler:link",
  },
  { key: "jwt-decoder", label: "JWT Decoder", icon: "tabler:key" },
  {
    key: "http-status",
    label: "HTTP Status Reference",
    icon: "tabler:list-numbers",
  },
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
