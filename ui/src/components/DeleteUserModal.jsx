import { useState } from "react";
import Button from "./Button";

export default function DeleteUserModal({ isOpen, onClose, onConfirm, targetUser }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isSelf = !targetUser || targetUser.isSelf;
  const userId = targetUser?.id;
  const userName = targetUser?.name || targetUser?.email || `User #${userId}`;

  async function handleDelete() {
    setError("");
    setDeleting(true);
    try {
      await onConfirm(userId);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-md bg-canvas p-6 shadow-xl border border-hairline">
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
          <h2 className="text-title-md text-ink">
            {isSelf ? "Delete Account" : `Delete User #${userId}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-full p-1 text-muted hover:bg-surface-soft hover:text-ink transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-sm border border-error/20 bg-error/5 p-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <p className="text-body-md text-ink mb-6">
          {isSelf ? (
            <>Are you sure you want to delete your account? This action cannot be undone.</>
          ) : (
            <>Are you sure you want to delete <strong>{userName}</strong> (ID: {userId})?</>
          )}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-10 rounded-sm border border-hairline bg-canvas px-4 text-button-sm text-ink hover:bg-surface-soft transition-colors"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 bg-error text-on-primary hover:bg-primary-error-text-hover"
          >
            {deleting ? "Deleting…" : "Confirm Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
