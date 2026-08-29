import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-hairline px-6 sm:px-8 bg-canvas">
      <div className="flex items-center gap-8">
        <BrandLogo />

        {/* Main Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-caption font-semibold transition-colors ${
                  isActive
                    ? "bg-surface-strong text-ink font-bold"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                }`
              }
            >
              Book Trains
            </NavLink>
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-caption font-semibold transition-colors ${
                  isActive
                    ? "bg-surface-strong text-ink font-bold"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                }`
              }
            >
              My Bookings
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-caption font-semibold transition-colors ${
                  isActive
                    ? "bg-surface-strong text-ink font-bold"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                }`
              }
            >
              Find Ticket
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-caption font-semibold transition-colors ${
                  isActive
                    ? "bg-surface-strong text-ink font-bold"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                }`
              }
            >
              My Account
            </NavLink>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <NavLink
            to="/profile"
            className="flex items-center gap-2.5 rounded-full border border-hairline px-3 py-1.5 bg-canvas shadow-xs hover:border-ink transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-caption-sm text-on-primary font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-body-sm font-medium text-ink hidden sm:inline max-w-[120px] truncate">
              {user.name || user.email}
            </span>
            {user.role && (
              <span className="rounded-full bg-surface-strong px-2 py-0.5 text-uppercase-tag text-muted font-semibold">
                {user.role}
              </span>
            )}
          </NavLink>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}