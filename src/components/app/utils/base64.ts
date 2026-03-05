export const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

export const fromTextToBase64 = (value: string) => {
  const encoded = new TextEncoder().encode(value);
  return toBase64(encoded);
};

export const fromBase64ToBytes = (value: string) => {
  const normalized = value.replace(/\s/g, "");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const fromBase64ToText = (value: string) => {
  const bytes = fromBase64ToBytes(value);
  return new TextDecoder().decode(bytes);
};
