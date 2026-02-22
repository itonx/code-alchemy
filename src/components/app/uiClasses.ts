export const ui = {
  shell:
    "grid h-screen overflow-hidden bg-[var(--bg)] transition-[grid-template-columns] duration-200 max-[920px]:grid-rows-[auto_minmax(0,1fr)] max-[920px]:content-start",
  shellExpanded: "min-[921px]:grid-cols-[300px_1fr]",
  shellCollapsed: "min-[921px]:grid-cols-[92px_1fr]",
  contentPanel:
    "relative flex min-w-0 overflow-x-hidden overflow-y-auto px-3 pb-3 pt-2 md:p-6",
  contentSwitch: "relative z-[1] mt-0 flex w-full min-h-0 min-w-0 md:mt-3",
  toolCard:
    "w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--bg))] p-4 flex flex-col gap-3",
  toolHeader: "space-y-1",
  toolTitle:
    "m-0 text-2xl font-bold text-[color-mix(in_srgb,var(--accent)_58%,var(--muted))]",
  toolDescription: "m-0 text-[var(--muted)]",
  fieldLabel:
    "text-xs font-semibold uppercase tracking-wide text-[var(--muted)]",
  textAreaFrame:
    "w-full min-h-[130px] rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent),0_0_14px_color-mix(in_srgb,var(--accent)_25%,transparent)]",
  textArea:
    "block h-full w-full min-h-[inherit] resize-none overflow-auto rounded-[inherit] border-0 bg-transparent p-3 [scrollbar-gutter:stable_both-edges] text-[color-mix(in_srgb,var(--accent)_28%,var(--muted))] outline-none",
  codePreview:
    "flex-1 min-h-[300px] overflow-auto rounded-xl border border-transparent p-3 [background-clip:padding-box] [scrollbar-gutter:stable_both-edges] shadow-[inset_0_0_0_1px_var(--border)] text-sm",
  button:
    "inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-semibold text-[color-mix(in_srgb,var(--accent)_60%,var(--muted))] transition hover:-translate-y-px hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)] disabled:cursor-not-allowed disabled:text-[color-mix(in_srgb,var(--accent)_50%,transparent)] disabled:bg-[color-mix(in_srgb,var(--surface)_90%,var(--bg))]",
  buttonPrimary:
    "border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_22%,var(--surface))] text-[var(--accent)]",
  compactInput:
    "w-full min-h-10 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] px-3 py-2 font-semibold text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]",
  optionCard: "flex flex-col gap-1.5",
  outputHead: "flex items-center justify-between gap-3",
  toolActions: "flex flex-wrap items-center gap-2",
  errorMeta:
    "m-0 text-sm font-semibold text-[color-mix(in_srgb,var(--accent)_70%,var(--muted))]",
  fileMeta: "m-0 text-sm text-[var(--muted)]",
  emptyMeta: "m-0 text-sm text-[var(--muted)]",
  uploadInline: "flex items-center gap-3",
  rangeInput: "w-full accent-[var(--accent)]",
};
