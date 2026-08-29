import { useSearchParams, Link } from "react-router-dom";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { formatCurrency } from "../utils/bookingUtils";
import TicketItem from "../components/orders/TicketItem";

function formatTimestamp(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(d);
  } catch {
    return ts;
  }
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("sessionId");

  const { order, isLoading, error } = useOrderDetails(orderId);

  const formattedDate = formatTimestamp(order?.createdAt);
  const formattedTotal = order ? formatCurrency(order.totalAmount) : "$0.00";
  const tickets = order?.tickets || [];

  return (
    <div className="flex-1 bg-canvas py-12 px-6 sm:px-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header & Celebration Icon */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <svg
              className="h-10 w-10 animate-in zoom-in-50 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-display-lg sm:text-display-xl font-bold text-ink tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-body-md text-muted max-w-md mx-auto">
            Your payment was processed successfully and your train tickets have been confirmed.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-hairline bg-surface-soft">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
            <p className="text-body-md text-muted font-medium">Retrieving confirmed booking details…</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-6 text-center space-y-3">
            <h3 className="text-title-md font-bold text-ink">Unable to Load Order #{orderId}</h3>
            <p className="text-body-sm text-error">{error}</p>
            <div className="pt-2">
              <Link
                to="/my-bookings"
                className="inline-flex items-center rounded-sm bg-primary px-5 py-2 text-caption font-bold text-white shadow-sm hover:bg-primary-active transition-colors"
              >
                Go to My Bookings
              </Link>
            </div>
          </div>
        )}

        {/* Order Details & Confirmed Tickets */}
        {!isLoading && order && (
          <div className="space-y-6">
            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-hairline bg-canvas p-6 sm:p-7 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-muted block">
                    Booking Reference
                  </span>
                  <span className="text-title-md font-extrabold text-ink font-mono">
                    Order #{order.orderId}
                  </span>
                  {formattedDate && (
                    <span className="text-caption-sm text-muted block mt-0.5">
                      Confirmed on {formattedDate}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-caption-sm font-bold text-emerald-800 uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Confirmed & Paid
                  </span>
                  {sessionId && (
                    <span className="text-[11px] font-mono text-muted mt-1 max-w-[200px] truncate" title={sessionId}>
                      Stripe: {sessionId}
                    </span>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-surface-soft p-4 border border-hairline text-caption">
                <div>
                  <span className="text-muted block text-[11px] uppercase font-bold">Total Paid</span>
                  <span className="text-display-sm font-extrabold text-ink font-mono mt-0.5 block">
                    {formattedTotal}
                  </span>
                </div>

                <div>
                  <span className="text-muted block text-[11px] uppercase font-bold">Seats Reserved</span>
                  <span className="text-display-sm font-extrabold text-ink mt-0.5 block">
                    {tickets.length} {tickets.length === 1 ? "seat" : "seats"}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-muted block text-[11px] uppercase font-bold">Payment Method</span>
                  <span className="text-body-md font-bold text-ink mt-0.5 block">
                    Stripe Checkout
                  </span>
                </div>
              </div>

              {/* Confirmed Tickets List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-title-sm font-bold text-ink">
                    Passenger Boarding Passes ({tickets.length})
                  </h3>
                  <span className="text-[12px] text-muted">
                    Click any ticket to view its boarding pass
                  </span>
                </div>

                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <TicketItem key={ticket.ticketId} ticket={ticket} />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas px-6 py-3 text-caption font-bold text-ink hover:bg-surface-soft transition-colors"
              >
                <span>Book Another Train</span>
              </Link>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-surface-soft px-6 py-3 text-caption font-bold text-ink hover:bg-surface-strong transition-colors"
                >
                  <span>Go to My Bookings</span>
                </Link>

                <Link
                  to={`/my-bookings/${order.orderId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                    <path d="M6 14h12v8H6z" />
                  </svg>
                  <span>View & Print Boarding Pass</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
