import type { ToolItem } from "./types";
import packageJson from "../../../package.json";

export const APP_NAME = "Code Alchemy";
export const APP_VERSION = `v${packageJson.version}`;

export const tools: ToolItem[] = [
  {
    key: "guid",
    label: "GUID Generator",
    icon: "tabler:fingerprint",
    description:
      "Create unique IDs instantly for APIs, databases, and testing.",
  },
  {
    key: "base64",
    label: "Base64 Converter",
    icon: "tabler:file-code-2",
    description:
      "Encode or decode text and payloads for web and API workflows.",
  },
  {
    key: "formatter",
    label: "Code Formatter",
    icon: "tabler:brackets-angle",
    description:
      "Beautify code into clean, readable structure across common languages.",
  },
  {
    key: "aes",
    label: "AES Encrypt / Decrypt",
    icon: "tabler:lock",
    description:
      "Encrypt sensitive text or decrypt AES payloads during debugging.",
  },
  {
    key: "text-diff",
    label: "Text Diff Checker",
    icon: "tabler:git-compare",
    description: "Compare two text versions and spot changes in seconds.",
  },
  {
    key: "color-picker",
    label: "Color Picker",
    icon: "tabler:color-picker",
    description:
      "Pick and refine colors with instant format conversion support.",
  },
  {
    key: "number-base",
    label: "Number Base Converter",
    icon: "tabler:binary-tree-2",
    description:
      "Convert numbers between binary, octal, decimal, and hexadecimal.",
  },
  {
    key: "timezone-converter",
    label: "Timezone Converter",
    icon: "tabler:world",
    description:
      "Translate time across regions to schedule globally without mistakes.",
  },
  {
    key: "hash",
    label: "Hash Generator",
    icon: "tabler:hash",
    description:
      "Generate hashes quickly to verify data and test integrations.",
  },
  {
    key: "random-number",
    label: "Random Number Generator",
    icon: "tabler:dice-6",
    description:
      "Create random values and ranges for fixtures and simulations.",
  },
  {
    key: "color-palette",
    label: "Color Palette Generator",
    icon: "tabler:palette",
    description:
      "Generate cohesive palettes for UI concepts and design systems.",
  },
  {
    key: "lorem-ipsum",
    label: "Lorem Ipsum Generator",
    icon: "tabler:file-text",
    description:
      "Produce placeholder copy fast for layouts and component previews.",
  },
  {
    key: "url-encoder",
    label: "URL Encoder / Decoder",
    icon: "tabler:link",
    description: "Encode or decode URL parameters for safer request handling.",
  },
  {
    key: "jwt-decoder",
    label: "JWT Decoder",
    icon: "tabler:key",
    description: "Inspect token headers and claims to debug auth flows faster.",
  },
  {
    key: "http-status",
    label: "HTTP Status Reference",
    icon: "tabler:list-numbers",
    description:
      "Look up status codes with meaning and practical usage context.",
  },
  {
    key: "markdown-editor",
    label: "Markdown Editor",
    icon: "tabler:markdown",
    description:
      "Write and preview markdown content with a clean live workflow.",
  },
  {
    key: "qr",
    label: "QR Generator",
    icon: "tabler:qrcode",
    description: "Generate QR codes for links, text, and rapid device testing.",
  },
  {
    key: "minifier",
    label: "Code Minifier",
    icon: "tabler:arrows-minimize",
    description: "Shrink code for production payloads and faster transfer.",
  },
  {
    key: "password",
    label: "Password Generator",
    icon: "tabler:key",
    description: "Create strong passwords with flexible complexity controls.",
  },
  {
    key: "image-resizer",
    label: "Image Resizer",
    icon: "tabler:dimensions",
    description: "Resize images for responsive UI and optimized delivery.",
  },
  {
    key: "image-compressor",
    label: "Image Compressor",
    icon: "tabler:photo-down",
    description:
      "Compress image files while preserving quality for web delivery.",
  },
];
