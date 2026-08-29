import { useCallback, useEffect, useState } from "react";
import { getAllUsers, getUserById } from "../api/users";
import { useAuth } from "../context/useAuth";
import DeleteUserModal from "./DeleteUserModal";

export default function AdminUserManagement() {
  const { deleteUser, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Inspection modal state
  const [inspectUser, setInspectUser] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectError, setInspectError] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteUser, setTargetDeleteUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleInspectUser(id) {
    setInspectUser(null);
    setInspectError("");
    setInspectLoading(true);
    try {
      const data = await getUserById(id);
      setInspectUser(data);
    } catch (err) {
      setInspectError(err.message || `Failed to fetch details for user #${id}`);
    } finally {
      setInspectLoading(false);
    }
  }

  function handleOpenDelete(userToDel) {
    setTargetDeleteUser({
      id: userToDel.id,
      name: userToDel.name,
      email: userToDel.email,
      isSelf: String(userToDel.id) === String(currentUser?.id),
    });
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete(id) {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    if (inspectUser && String(inspectUser.id) === String(id)) {
      setInspectUser(null);
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      String(u.id).includes(search) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full max-w-4xl rounded-md border border-hairline bg-canvas p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-display-sm text-ink">User Management</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-badge text-primary border border-primary/20">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-body-sm text-muted mt-1">
            View, search, and manage registered system accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-hairline bg-canvas px-4 text-button-sm text-ink hover:bg-surface-soft transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh List
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-sm border border-error/20 bg-error/5 p-4 text-body-sm text-error">
          {error}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by ID, name, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-sm border border-hairline bg-canvas px-3 pl-9 text-body-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-caption-sm text-muted">Role:</span>
          {["ALL", "USER", "ADMIN"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`h-8 px-3 rounded-full text-caption-sm font-medium transition-colors ${
                roleFilter === role
                  ? "bg-ink text-on-dark"
                  : "bg-surface-soft text-ink hover:bg-surface-strong"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="py-12 text-center text-body-md text-muted animate-pulse">
          Loading user directory…
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-hairline rounded-sm p-6">
          <p className="text-body-md text-muted">No users found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-hairline">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft text-caption-sm text-muted">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Joined</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredUsers.map((u) => {
                const isCurrent = String(u.id) === String(currentUser?.id);
                return (
                  <tr key={u.id} className="hover:bg-surface-soft/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-body-sm text-ink font-semibold">
                      #{u.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-caption-sm font-bold">
                          {u.name ? u.name.charAt(0).toUpperCase() : u.email ? u.email.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="text-body-sm font-medium text-ink flex items-center gap-1.5">
                            {u.name || "N/A"}
                            {isCurrent && (
                              <span className="text-caption-sm text-primary font-semibold">(You)</span>
                            )}
                          </div>
                          <div className="text-caption-sm text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-uppercase-tag font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-surface-strong text-ink"
                        }`}
                      >
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-body-sm text-muted">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleInspectUser(u.id)}
                          className="h-8 px-2.5 rounded-sm border border-hairline bg-canvas text-caption-sm text-ink hover:bg-surface-soft transition-colors"
                        >
                          Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(u)}
                          className="h-8 px-2.5 rounded-sm border border-error/30 bg-error/5 text-caption-sm text-error hover:bg-error/15 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect User Modal / Drawer */}
      {(inspectUser || inspectLoading || inspectError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-md bg-canvas p-6 shadow-xl border border-hairline">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
              <h3 className="text-title-md text-ink">
                User Details <span className="text-caption-sm text-muted font-mono">(ID: #{inspectUser?.id || "…"})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setInspectUser(null);
                  setInspectError("");
                }}
                className="rounded-full p-1 text-muted hover:bg-surface-soft hover:text-ink transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {inspectLoading ? (
              <div className="py-8 text-center text-body-md text-muted animate-pulse">
                Loading user details…
              </div>
            ) : inspectError ? (
              <div className="rounded-sm border border-error/20 bg-error/5 p-4 text-body-sm text-error mb-4">
                {inspectError}
              </div>
            ) : inspectUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-sm bg-surface-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-display-sm text-on-primary font-bold">
                    {inspectUser.name ? inspectUser.name.charAt(0).toUpperCase() : inspectUser.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="text-title-sm text-ink">{inspectUser.name || "N/A"}</h4>
                    <p className="text-body-sm text-muted">{inspectUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-body-sm border-t border-hairline pt-4">
                  <div>
                    <span className="text-caption-sm text-muted block">ID</span>
                    <span className="font-mono text-ink font-semibold">#{inspectUser.id}</span>
                  </div>
                  <div>
                    <span className="text-caption-sm text-muted block">Role</span>
                    <span className="text-ink font-semibold">{inspectUser.role}</span>
                  </div>
                  <div>
                    <span className="text-caption-sm text-muted block">Created At</span>
                    <span className="text-ink">
                      {inspectUser.createdAt ? new Date(inspectUser.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setInspectUser(null);
                  setInspectError("");
                }}
                className="h-10 px-5 rounded-sm border border-hairline bg-canvas text-button-sm text-ink hover:bg-surface-soft transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        targetUser={targetDeleteUser}
      />
    </div>
  );
}
