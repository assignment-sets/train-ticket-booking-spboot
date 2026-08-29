export default function Brand({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="train ticket booking"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <rect x="4" y="6" width="24" height="20" rx="4" fill="#ff385c" />
        <path
          d="M12 10v8m0 4v.01M20 10v8m0-8a3 3 0 0 1 3 3M20 10a3 3 0 0 0-3 3"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 24h10"
          stroke="#ff385c"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-button-md font-semibold tracking-tight text-ink">
        train&nbsp;
        <span className="text-primary">ticket</span>&nbsp;booking
      </span>
    </span>
  )
}