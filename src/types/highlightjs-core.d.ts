declare module "highlight.js/lib/core" {
  type AutoHighlightResult = {
    language?: string;
  };

  type HighlightJsCore = {
    registerLanguage: (languageName: string, language: unknown) => void;
    highlightAuto: (
      code: string,
      languageSubset?: string[],
    ) => AutoHighlightResult;
  };

  const hljs: HighlightJsCore;
  export default hljs;
}

declare module "highlight.js/lib/core.js" {
  export { default } from "highlight.js/lib/core";
}
