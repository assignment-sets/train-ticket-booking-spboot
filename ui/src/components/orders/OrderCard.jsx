import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/bookingUtils";
import TicketItem from "./TicketItem";

function formatOrderDate(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function OrderCard({ order }) {
  const {
    orderId,
    totalAmount,
    status,
    checkoutUrl,
    createdAt,
    tickets = [],
  } = order;

  const normalizedStatus = (status || "").toUpperCase();
  const isConfirmed =
    normalizedStatus === "CONFIRMED" ||
    normalizedStatus === "PAID" ||
    normalizedStatus === "COMPLETED";
  const isPending =
    normalizedStatus === "PENDING_PAYMENT" || normalizedStatus === "PENDING";
  const isCancelled = normalizedStatus === "CANCELLED";

  const formattedDate = formatOrderDate(createdAt);
  const formattedTotal = formatCurrency(totalAmount);

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-md transition-all hover:shadow-lg space-y-5 ${
        isCancelled
          ? "border-rose-300 bg-rose-50/20"
          : isPending
          ? "border-amber-300 bg-amber-50/20"
          : "border-hairline bg-canvas"
      }`}
    >
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-title-md font-bold text-ink">Order #{orderId}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-caption-sm font-bold uppercase tracking-wider ${
                isConfirmed
                  ? "bg-emerald-100 text-emerald-800"
                  : isPending
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : isCancelled
                  ? "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold"
                  : "bg-surface-strong text-muted"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isConfirmed
                    ? "bg-emerald-600"
                    : isPending
                    ? "bg-amber-600 animate-ping"
                    : isCancelled
                    ? "bg-rose-600"
                    : "bg-muted"
                }`}
              />
              {isConfirmed ? "Confirmed" : isPending ? "Pending Payment" : isCancelled ? "Cancelled" : status}
            </span>
          </div>

          {formattedDate && (
            <p className="text-caption-sm text-muted mt-1">
              Booked on {formattedDate}
            </p>
          )}
        </div>

        {/* Action Button for Pending Payment */}
        {isPending && checkoutUrl && (
          <a
            href={checkoutUrl}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-button-sm font-bold text-white shadow-sm hover:bg-primary-active transition-all"
          >
            <span>Complete Stripe Payment</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>

      {/* Passenger Tickets List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-caption font-bold text-muted uppercase tracking-wider">
            Passenger Tickets ({tickets.length})
          </span>
          <span className="text-[12px] text-muted">
            Click any ticket to view its details
          </span>
        </div>

        {tickets.length === 0 ? (
          <p className="text-caption text-muted py-2">No individual ticket details found for this order.</p>
        ) : (
          tickets.map((ticket) => (
            <TicketItem key={ticket.ticketId} ticket={ticket} />
          ))
        )}
      </div>

      {/* Order Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-hairline pt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-caption text-muted font-medium">Total:</span>
          <span className="text-display-md font-extrabold text-ink">{formattedTotal}</span>
          <span className="text-caption-sm text-muted">({tickets.length} {tickets.length === 1 ? "seat" : "seats"})</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/my-bookings/${orderId}`}
            className="inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-soft px-4 py-2 text-caption font-bold text-ink hover:bg-surface-strong transition-colors cursor-pointer"
          >
            {isConfirmed ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <path d="M6 14h12v8H6z" />
                </svg>
                <span>View Receipt & Print (All Tickets)</span>
              </>
            ) : isCancelled ? (
              <span>View Cancelled Order Details →</span>
            ) : (
              <span>View Pending Order Details →</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
