import { useId } from "react"

export default function TextInput({
  label,
  id,
  type = "text",
  autoComplete,
  error,
  hint,
  value,
  onChange,
  ...rest
}) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={`text-caption ${error ? "text-error" : "text-muted"}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`h-14 w-full rounded-sm border-2 bg-canvas px-3 py-3.5 text-body-md text-ink placeholder:text-muted-soft focus:outline-none ${
          error
            ? "border-error shadow-[inset_0_0_0_1px_transparent]"
            : "border-transparent shadow-[inset_0_0_0_1px_var(--color-hairline)] focus:border-ink focus:shadow-[inset_0_0_0_1px_transparent]"
        }`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? (
        <p className="text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-body-sm text-muted-soft">{hint}</p>
      ) : null}
    </div>
  )
}