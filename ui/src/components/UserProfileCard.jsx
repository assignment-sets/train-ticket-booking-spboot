import { useState } from "react";
import { useAuth } from "../context/useAuth";
import DeleteUserModal from "./DeleteUserModal";

export default function UserProfileCard() {
  const { user, loading, error, refetchUser, deleteUser, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  if (loading) {
    return (
      <div className="w-full max-w-xl rounded-md border border-hairline bg-canvas p-8 shadow-sm">
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-surface-strong" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 rounded bg-surface-strong" />
            <div className="h-4 w-60 rounded bg-surface-strong" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-xl rounded-md border border-hairline bg-canvas p-6 shadow-sm">
        <p className="text-body-md text-muted">No user profile loaded.</p>
        {error && <p className="mt-2 text-body-sm text-error">{error}</p>}
        <button
          type="button"
          onClick={refetchUser}
          className="mt-4 rounded-sm border border-hairline px-4 py-2 text-button-sm text-ink hover:bg-surface-soft"
        >
          Retry Loading Profile
        </button>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  function handleOpenSelfDelete() {
    setTargetUser({ id: user.id, name: user.name, email: user.email, isSelf: true });
    setModalOpen(true);
  }

  async function handleConfirmDelete(id) {
    await deleteUser(id);
    if (String(id) === String(user.id)) {
      logout();
    }
  }

  return (
    <div className="w-full max-w-xl rounded-md border border-hairline bg-canvas p-8 shadow-sm">
      <div className="flex items-start justify-between border-b border-hairline pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-display-md text-on-primary font-bold">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-display-sm text-ink">{user.name || "User"}</h2>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-badge font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-surface-strong text-ink"
                }`}
              >
                {user.role || "USER"}
              </span>
            </div>
            <p className="text-body-sm text-muted">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetchUser}
          title="Refresh profile"
          className="rounded-full border border-hairline p-2 text-muted hover:bg-surface-soft hover:text-ink transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 py-6 border-b border-hairline">
        <div>
          <span className="text-caption-sm text-muted block mb-1">User ID</span>
          <span className="text-body-md font-mono text-ink font-semibold">#{user.id}</span>
        </div>
        <div>
          <span className="text-caption-sm text-muted block mb-1">Account Created</span>
          <span className="text-body-md text-ink">{formattedDate}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={handleOpenSelfDelete}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-error/30 bg-error/5 px-4 text-button-sm text-error hover:bg-error/15 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Delete Account
        </button>
      </div>

      <DeleteUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        targetUser={targetUser}
      />
    </div>
  );
}
