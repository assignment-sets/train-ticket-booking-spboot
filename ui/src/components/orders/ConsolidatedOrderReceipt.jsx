import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/bookingUtils";

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

export default function ConsolidatedOrderReceipt({ order }) {
  if (!order) return null;

  const {
    orderId,
    totalAmount,
    status,
    idempotencyKey,
    checkoutUrl,
    createdAt,
    tickets = [],
  } = order;

  const formattedTotal = formatCurrency(totalAmount);
  const formattedDate = formatTimestamp(createdAt);
  const isConfirmed = status === "CONFIRMED" || status === "PAID" || status === "COMPLETED";
  const isPending = status === "PENDING_PAYMENT" || status === "PENDING";
  const isCancelled = status === "CANCELLED";

  function handlePrint() {
    if (!isConfirmed) return;
    window.print();
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Printable Receipt Card */}
      <div
        className={`rounded-2xl border-2 bg-canvas shadow-xl overflow-hidden print:border print:shadow-none p-6 sm:p-10 space-y-8 transition-colors ${
          isCancelled
            ? "border-rose-500 bg-rose-50/20 shadow-rose-100"
            : isPending
            ? "border-amber-400 bg-amber-50/20 shadow-amber-100"
            : "border-hairline"
        }`}
      >
        {/* Dominant Banner for Non-Confirmed Orders */}
        {isCancelled && (
          <div className="rounded-xl bg-rose-600 p-4 text-white flex items-center justify-between gap-3 font-bold text-caption uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Order Cancelled — All Passenger Tickets Are Void</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono">NON-PRINTABLE</span>
          </div>
        )}

        {isPending && (
          <div className="rounded-xl bg-amber-500 p-4 text-white flex items-center justify-between gap-3 font-bold text-caption uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Pending Payment — Official Tickets Not Yet Issued</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono">NON-PRINTABLE</span>
          </div>
        )}

        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-dashed border-hairline pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold ${
                  isCancelled ? "bg-rose-600" : isPending ? "bg-amber-500" : "bg-primary"
                }`}
              >
                🚆
              </div>
              <h2 className="text-display-md font-bold text-ink">
                {isConfirmed ? "Official Railway Booking Receipt" : "Reservation Receipt"}
              </h2>
            </div>
            <p className="text-caption-sm text-muted mt-1">
              Consolidated group booking confirmation & passenger tickets
            </p>
          </div>

          <div className="flex flex-col sm:items-end">
            <span
              className={`rounded-full px-3.5 py-1 text-caption-sm font-bold uppercase tracking-wider inline-block ${
                isConfirmed
                  ? "bg-emerald-100 text-emerald-800"
                  : isPending
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : isCancelled
                  ? "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold"
                  : "bg-surface-strong text-muted"
              }`}
            >
              {isConfirmed ? "Confirmed & Paid" : isPending ? "Pending Payment" : status}
            </span>
            <span className="text-[12px] text-muted mt-1">Booked on: {formattedDate}</span>
          </div>
        </div>

        {/* Order Details Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-soft border border-hairline text-caption">
          <div>
            <span className="text-muted block text-[11px] uppercase font-bold">Order Reference</span>
            <span className="text-body-md font-bold text-ink font-mono">ORD-{orderId}</span>
          </div>

          <div>
            <span className="text-muted block text-[11px] uppercase font-bold">Total Passenger Tickets</span>
            <span className="text-body-md font-bold text-ink">{tickets.length} seats reserved</span>
          </div>

          <div>
            <span className="text-muted block text-[11px] uppercase font-bold">Transaction Reference</span>
            <span className="text-body-sm font-mono text-ink truncate block">
              {idempotencyKey || "TXN-DIRECT"}
            </span>
          </div>
        </div>

        {/* Passenger Tickets Sequential Breakdown */}
        <div className="space-y-4">
          <h3 className="text-title-md font-bold text-ink">Passenger Boarding Tickets</h3>

          <div className="space-y-4 divide-y divide-hairline">
            {tickets.map((t, idx) => (
              <div key={t.ticketId || idx} className="pt-4 first:pt-0">
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
                    isCancelled
                      ? "border-rose-200 bg-rose-50/40"
                      : isPending
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-hairline bg-canvas hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-strong text-caption font-bold text-ink shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-md font-bold text-ink">{t.trainName}</span>
                        <span className="font-mono text-caption-sm text-muted">#{t.trainNumber}</span>
                        <Link
                          to={`/tickets/${t.ticketId}`}
                          className={`text-[11px] hover:underline font-bold print:hidden ${
                            isCancelled ? "text-rose-600" : isPending ? "text-amber-700" : "text-primary"
                          }`}
                        >
                          View Individual Pass →
                        </Link>
                      </div>

                      <div className="text-caption-sm text-ink mt-1">
                        <strong>Route:</strong> {t.sourceStation} → {t.destinationStation}
                      </div>
                      <div className="text-[12px] text-muted">
                        Journey Date: <strong>{t.journeyDate}</strong> · Ticket #{t.ticketId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-hairline pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] uppercase font-bold text-muted block">Seat</span>
                      <span
                        className={`text-body-md font-extrabold block ${
                          isCancelled ? "text-rose-600 line-through" : isPending ? "text-amber-700" : "text-primary"
                        }`}
                      >
                        #{t.seatNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] uppercase font-bold text-muted block">Fare</span>
                      <span className="text-body-md font-bold text-ink block">
                        {formatCurrency(t.fare)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fare Summary & Total */}
        <div className="border-t-2 border-dashed border-hairline pt-6">
          <div className="max-w-xs ml-auto space-y-2 text-caption">
            <div className="flex items-center justify-between text-muted">
              <span>Base Fare ({tickets.length} tickets):</span>
              <span>{formattedTotal}</span>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Taxes & Station Fees:</span>
              <span>$0.00</span>
            </div>
            <div className="flex items-center justify-between text-title-md font-bold text-ink border-t border-hairline pt-2">
              <span>Total {isConfirmed ? "Paid" : "Due"}:</span>
              <span className="text-display-md text-ink">{formattedTotal}</span>
            </div>
          </div>
        </div>

        {/* Consolidated Barcode OR Status Notice */}
        {isConfirmed ? (
          <div className="border-t border-hairline pt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 h-10">
              {[3, 2, 5, 2, 4, 6, 2, 7, 3, 4, 2, 6, 3, 5, 2, 8, 3, 4, 6, 2, 5, 3, 6, 2].map((w, i) => (
                <span key={i} className="bg-ink h-8 inline-block rounded-xs" style={{ width: `${w}px` }} />
              ))}
            </div>
            <p className="font-mono text-[11px] text-muted uppercase tracking-widest">
              CONSOLIDATED-GATE-SCAN: ORD-{orderId}-REF
            </p>
          </div>
        ) : isCancelled ? (
          <div className="border-2 border-dashed border-rose-300 rounded-xl bg-rose-50/60 p-4 text-center space-y-1">
            <span className="text-title-md font-bold text-rose-600 uppercase tracking-widest font-mono">
              ORDER CANCELLED · BARCODE DISABLED
            </span>
          </div>
        ) : (
          <div className="border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/60 p-4 text-center space-y-1">
            <span className="text-title-md font-bold text-amber-800 uppercase tracking-wider font-mono">
              CHECKOUT PENDING · TICKETS NOT ACTIVATED
            </span>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          to="/my-bookings"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas px-5 py-2.5 text-caption font-bold text-ink hover:bg-surface-soft transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m7 7l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to All Bookings</span>
        </Link>

        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          {/* Confirmed: Print button */}
          {isConfirmed && (
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              <span>Print All Tickets (Consolidated)</span>
            </button>
          )}

          {/* Pending: Complete Payment CTA */}
          {isPending && checkoutUrl && (
            <a
              href={checkoutUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all"
            >
              <span>Complete Stripe Payment</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}

          {/* Cancelled: Non-printable explanation */}
          {isCancelled && (
            <span className="text-caption font-bold text-rose-700 bg-rose-100 px-4 py-2 rounded-sm border border-rose-200">
              Order Cancelled — Printing Disabled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
