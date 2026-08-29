import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/bookingUtils";
import { TICKET_STATUS_LABELS } from "../../constants/booking";

export default function TicketItem({ ticket }) {
  const {
    ticketId,
    trainNumber,
    trainName,
    journeyDate,
    seatNumber,
    sourceStation,
    destinationStation,
    status,
    fare,
  } = ticket;

  const formattedFare = formatCurrency(fare);
  const isConfirmed = status === "CONFIRMED";
  const isPending = status === "PENDING_PAYMENT";
  const isCancelled = status === "CANCELLED";

  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
        isCancelled
          ? "border-rose-200 bg-rose-50/30 hover:border-rose-400"
          : isPending
          ? "border-amber-200 bg-amber-50/30 hover:border-amber-400"
          : "border-hairline bg-surface-soft hover:border-border-strong hover:bg-surface-strong/60"
      }`}
    >
      {/* Left: Train & Journey Details */}
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas border shadow-2xs ${
            isCancelled
              ? "border-rose-300 text-rose-600"
              : isPending
              ? "border-amber-300 text-amber-600"
              : "border-hairline text-ink"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="3" width="16" height="16" rx="2" />
            <path d="M4 11h16" />
            <path d="M12 3v8" />
            <circle cx="8" cy="15" r="1" />
            <circle cx="16" cy="15" r="1" />
            <path d="M8 19l-2 3" />
            <path d="M16 19l2 3" />
          </svg>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-body-sm font-bold text-ink">{trainName || "Express Train"}</h4>
            <span className="rounded bg-canvas border border-hairline px-1.5 py-0.2 font-mono text-[11px] font-semibold text-ink">
              #{trainNumber || "---"}
            </span>
            <span className="text-[11px] text-muted">Ticket #{ticketId}</span>
            <Link
              to={`/tickets/${ticketId}`}
              className={`text-[11px] font-bold hover:underline ml-1 ${
                isCancelled ? "text-rose-600" : isPending ? "text-amber-700" : "text-primary"
              }`}
            >
              {isCancelled ? "View Cancelled Pass →" : isPending ? "View Pending Pass →" : "View Pass →"}
            </Link>
          </div>

          {/* Route */}
          <div className="flex items-center gap-1.5 text-caption-sm text-ink font-semibold mt-1">
            <span>{sourceStation || "Origin"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted">
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{destinationStation || "Destination"}</span>
          </div>

          {/* Date */}
          <p className="text-[12px] text-muted mt-0.5">
            Journey Date: <span className="font-semibold text-ink">{journeyDate}</span>
          </p>
        </div>
      </div>

      {/* Right: Seat Number, Status & Fare */}
      <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-hairline pt-3 sm:pt-0">
        <div className="flex flex-col sm:items-end">
          <span className="text-[11px] uppercase font-bold text-muted tracking-wider">Seat Assigned</span>
          <span
            className={`text-body-md font-extrabold bg-canvas border px-2.5 py-0.5 rounded-md mt-0.5 ${
              isCancelled
                ? "text-rose-600 line-through border-rose-200"
                : isPending
                ? "text-amber-700 border-amber-200"
                : "text-ink border-hairline"
            }`}
          >
            #{seatNumber}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-body-md font-bold text-ink">{formattedFare}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-1 ${
              isConfirmed
                ? "bg-emerald-100 text-emerald-800"
                : isPending
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : isCancelled
                ? "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold"
                : "bg-surface-strong text-muted"
            }`}
          >
            {TICKET_STATUS_LABELS[status] || status}
          </span>
        </div>
      </div>
    </div>
  );
}
