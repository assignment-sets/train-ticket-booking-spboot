export default function SocialButtons() {
  const base =
    "flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas text-button-md text-ink transition-colors hover:bg-surface-soft"

  return (
    <div className="flex flex-col gap-3">
      <button type="button" className={base}>
        <AppleIcon />
        Continue with Apple
      </button>
      <button type="button" className={base}>
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.8.9-2.11 1.6-3.2 1.5-.07-1.1.41-2.26 1.08-3 .72-.8 2.09-1.47 3.24-1.48zM20.94 17.21c-.51 1.15-.75 1.67-1.4 2.7-.92 1.44-2.2 3.23-3.8 3.24-1.42.01-1.8-.93-3.75-.92-1.95 0-2.35.94-3.77.92-1.59-.02-2.82-1.65-3.74-3.09C2.43 15.51 1.95 10.75 3.6 7.6c1.18-2.27 3.08-3.6 4.86-3.6 1.8 0 2.9 1 4.35 1 1.42 0 2.29-1 4.34-1 1.56 0 3.19.87 4.36 2.35-3.83 2.12-3.2 7.65.43 8.86z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.35 12.23c0-.7-.06-1.37-.18-2.02H12v3.83h5.24a4.9 4.9 0 0 1-2.13 3.22v2.68h3.45c2.02-1.86 3.18-4.6 3.18-7.71z"
        fill="#4285F4"
      />
      <path
        d="M12 21.5c2.89 0 5.31-.96 7.08-2.6l-3.45-2.68c-.96.64-2.18 1.02-3.63 1.02-2.79 0-5.15-1.88-6-4.42H2.42v2.77A10.7 10.7 0 0 0 12 21.5z"
        fill="#34A853"
      />
      <path
        d="M6 12.82c-.2-.64-.32-1.32-.32-2.02s.12-1.38.32-2.02V6.01H2.42a10.7 10.7 0 0 0 0 9.58L6 12.82z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.77c1.57 0 2.98.54 4.09 1.6l3.06-3.06A10.4 10.4 0 0 0 12 1.5a10.7 10.7 0 0 0-9.58 4.51L6 8.78C6.85 6.3 9.21 5.77 12 5.77z"
        fill="#EA4335"
      />
    </svg>
  )
}