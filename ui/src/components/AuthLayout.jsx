import BrandLogo from "./BrandLogo"

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-20 items-center justify-between border-b border-hairline px-8">
        <BrandLogo />
        <button
          type="button"
          className="flex h-10 items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3 text-body-sm text-ink transition-colors hover:bg-surface-soft"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          English (US)
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px] rounded-xl border border-hairline bg-canvas p-8 shadow-card sm:p-10">
          {children}
        </div>
      </main>

      <footer className="border-t border-hairline px-8 py-6 text-center text-caption-sm text-muted">
        © 2026 train ticket booking, Inc.
      </footer>
    </div>
  )
}