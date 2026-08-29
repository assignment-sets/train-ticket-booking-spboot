import UserProfileCard from "../components/UserProfileCard";
import AdminUserManagement from "../components/AdminUserManagement";
import { useAuth } from "../context/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-canvas pb-24">
      {/* Hero Header */}
      <section className="bg-surface-soft border-b border-hairline py-10 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-lg sm:text-display-xl text-ink font-bold tracking-tight">
              My Account & Settings
            </h1>
            <p className="text-body-md text-muted mt-1">
              Manage your personal profile, role permissions, and account credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area on White Canvas */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8 flex flex-col items-center">
        <UserProfileCard />

        {user?.role === "ADMIN" && <AdminUserManagement />}
      </main>
    </div>
  );
}
