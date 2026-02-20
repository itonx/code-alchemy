type OptionCheckboxProps = {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function OptionCheckbox({
  id,
  label,
  checked,
  onChange,
}: OptionCheckboxProps) {
  return (
    <label
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--surface)_92%,var(--bg))] px-3 text-sm text-[color-mix(in_srgb,var(--accent)_30%,var(--muted))]"
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
