export default function Button({
  children,
  variant = "primary",
  type = "button",
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm transition-colors duration-150 disabled:cursor-not-allowed text-button-md select-none"

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-active",
    secondary:
      "bg-canvas text-ink border border-hairline hover:border-border-strong",
    tertiary:
      "bg-transparent text-ink underline-offset-2 hover:underline",
    "primary-disabled": "bg-primary-disabled text-white",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        base,
        variants[disabled && variant === "primary" ? "primary-disabled" : variant],
        fullWidth ? "w-full" : "",
        variant === "primary" || variant === "secondary" ? "h-12 px-6 rounded-sm" : "px-2 py-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  )
}