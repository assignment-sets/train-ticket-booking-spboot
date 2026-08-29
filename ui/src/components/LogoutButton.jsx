import { useNavigate } from "react-router-dom"
import { clearAuth } from "../lib/auth"

export default function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate("/login", { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline bg-canvas px-4 text-button-sm text-ink transition-colors hover:bg-surface-soft"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Log out
    </button>
  )
}