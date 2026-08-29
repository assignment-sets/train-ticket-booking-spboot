import { Link } from "react-router-dom";
import { useMyOrders } from "../hooks/useMyOrders";
import OrderCard from "../components/orders/OrderCard";

export default function MyBookingsPage() {
  const {
    filteredOrders,
    isLoading,
    error,
    filterStatus,
    setFilterStatus,
    counts,
    fetchOrders,
  } = useMyOrders();

  const filterTabs = [
    { id: "ALL", label: "All Bookings", count: counts.all },
    { id: "CONFIRMED", label: "Confirmed", count: counts.confirmed },
    { id: "PENDING_PAYMENT", label: "Pending Payment", count: counts.pending },
    { id: "CANCELLED", label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <div className="flex-1 bg-canvas pb-24">
      {/* Page Hero Header */}
      <section className="bg-surface-soft border-b border-hairline py-10 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-lg sm:text-display-xl text-ink font-bold tracking-tight">
              My Bookings & Tickets
            </h1>
            <p className="text-body-md text-muted mt-1">
              Manage your upcoming train journeys, boarding passes, and receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2 text-caption font-bold text-ink shadow-2xs hover:border-ink transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 text-muted ${isLoading ? "animate-spin text-primary" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-caption font-bold text-white shadow-sm hover:bg-primary-active transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Book New Ticket</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-error/20 bg-error/5 p-4 text-body-sm text-error font-medium"
          >
            {error}
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-hairline">
          {filterTabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-caption font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-ink hover:border-hairline"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[11px] font-bold ${
                    isActive ? "bg-primary/10 text-primary" : "bg-surface-soft text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
            <p className="text-body-md text-muted font-medium">Loading your booking orders…</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-hairline rounded-2xl p-8 bg-surface-soft/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-strong text-muted mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 2v4M16 2v4" />
              </svg>
            </div>
            <h3 className="text-title-md font-bold text-ink">No Bookings Found</h3>
            <p className="text-body-sm text-muted mt-1 max-w-sm mx-auto">
              {filterStatus === "ALL"
                ? "You haven't made any train reservations yet. Search and book your first journey now!"
                : `No orders found matching the "${filterTabs.find((t) => t.id === filterStatus)?.label}" filter.`}
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-button-sm font-bold text-white shadow-sm hover:bg-primary-active transition-colors"
            >
              Search Trains & Book
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
