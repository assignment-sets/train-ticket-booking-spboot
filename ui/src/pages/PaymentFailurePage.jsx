import { useSearchParams, Link } from "react-router-dom";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { formatCurrency } from "../utils/bookingUtils";
import TicketItem from "../components/orders/TicketItem";

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { order, isLoading, error } = useOrderDetails(orderId);

  const formattedTotal = order ? formatCurrency(order.totalAmount) : "$0.00";
  const tickets = order?.tickets || [];
  const checkoutUrl = order?.checkoutUrl;

  return (
    <div className="flex-1 bg-canvas py-12 px-6 sm:px-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header & Warning Icon */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
            <svg
              className="h-10 w-10 animate-in zoom-in-50 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-display-lg sm:text-display-xl font-bold text-ink tracking-tight">
            Payment Incomplete or Cancelled
          </h1>
          <p className="text-body-md text-muted max-w-md mx-auto">
            Your payment was not completed. Your seats are temporarily reserved under your pending order.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-hairline bg-surface-soft">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
            <p className="text-body-md text-muted font-medium">Retrieving pending reservation details…</p>
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

        {/* Order Details & Pending Tickets */}
        {!isLoading && order && (
          <div className="space-y-6">
            {/* Status Summary Card */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-7 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800 block">
                    Pending Reservation
                  </span>
                  <span className="text-title-md font-extrabold text-ink font-mono">
                    Order #{order.orderId}
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-caption-sm font-bold text-amber-900 border border-amber-300 uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
                    Pending Payment
                  </span>
                </div>
              </div>

              {/* Summary Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-canvas p-4 border border-hairline text-caption">
                <div>
                  <span className="text-muted block text-[11px] uppercase font-bold">Amount Due</span>
                  <span className="text-display-sm font-extrabold text-ink font-mono mt-0.5 block">
                    {formattedTotal}
                  </span>
                </div>

                <div>
                  <span className="text-muted block text-[11px] uppercase font-bold">Seats on Hold</span>
                  <span className="text-display-sm font-extrabold text-ink mt-0.5 block">
                    {tickets.length} {tickets.length === 1 ? "seat" : "seats"}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-muted block text-[11px] uppercase font-bold">Status</span>
                  <span className="text-body-md font-bold text-amber-700 mt-0.5 block">
                    Awaiting Checkout
                  </span>
                </div>
              </div>

              {/* Reserved Tickets List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-title-sm font-bold text-ink">
                    Reserved Seats on Hold ({tickets.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <TicketItem key={ticket.ticketId} ticket={ticket} />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas px-6 py-3 text-caption font-bold text-ink hover:bg-surface-soft transition-colors"
              >
                <span>Start New Search</span>
              </Link>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-surface-soft px-6 py-3 text-caption font-bold text-ink hover:bg-surface-strong transition-colors"
                >
                  <span>Review in My Bookings</span>
                </Link>

                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all"
                  >
                    <span>Retry Stripe Payment</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all"
                  >
                    <span>Proceed to My Bookings</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
