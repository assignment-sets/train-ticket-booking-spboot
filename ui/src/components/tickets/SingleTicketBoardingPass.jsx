import { Link } from "react-router-dom";
import { formatCurrency, formatLocalTime } from "../../utils/bookingUtils";
import { SEAT_TYPE_LABELS, TICKET_STATUS_LABELS } from "../../constants/booking";

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

export default function SingleTicketBoardingPass({ ticket }) {
  if (!ticket) return null;

  const {
    ticketId,
    orderId,
    bookedByName,
    bookedByEmail,
    trainNumber,
    trainName,
    journeyDate,
    coachNumber,
    seatNumber,
    seatType,
    sourceStationCode,
    sourceStationName,
    sourceCity,
    departureTime,
    destinationStationCode,
    destinationStationName,
    destinationCity,
    arrivalTime,
    bookingTime,
    fare,
    status,
  } = ticket;

  const formattedFare = formatCurrency(fare);
  const depTimeStr = formatLocalTime(departureTime, { format12h: true });
  const arrTimeStr = formatLocalTime(arrivalTime, { format12h: true });
  const formattedBookingTime = formatTimestamp(bookingTime);

  const isConfirmed = status === "CONFIRMED";
  const isPending = status === "PENDING_PAYMENT";
  const isCancelled = status === "CANCELLED";

  function handlePrint() {
    if (!isConfirmed) return;
    window.print();
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Boarding Pass Card */}
      <div
        className={`relative rounded-2xl border-2 bg-canvas shadow-xl overflow-hidden print:border print:shadow-none transition-colors ${
          isCancelled
            ? "border-rose-500 bg-rose-50/20 shadow-rose-100"
            : isPending
            ? "border-amber-400 bg-amber-50/20 shadow-amber-100"
            : "border-hairline"
        }`}
      >
        {/* Dominant Status Alert Header Banner for Non-Confirmed Tickets */}
        {isCancelled && (
          <div className="bg-rose-600 px-6 py-3 text-white flex items-center justify-between gap-3 font-bold text-caption uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Void / Cancelled — Not Valid For Train Boarding</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono">NON-PRINTABLE</span>
          </div>
        )}

        {isPending && (
          <div className="bg-amber-500 px-6 py-3 text-white flex items-center justify-between gap-3 font-bold text-caption uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Pending Payment — Temporary Reservation Hold</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono">NON-PRINTABLE</span>
          </div>
        )}

        {/* Top Header Stripe */}
        <div
          className={`px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3 ${
            isCancelled ? "bg-rose-950" : isPending ? "bg-stone-900" : "bg-ink"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-bold ${
                isCancelled ? "bg-rose-600" : isPending ? "bg-amber-500" : "bg-primary"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <span className="text-caption-sm text-white/70 uppercase tracking-widest font-mono">
                {isConfirmed ? "Official Boarding Pass" : "Passenger Reservation"}
              </span>
              <h2 className="text-title-md font-bold text-white leading-tight">
                {trainName || "Express Train"} (#{trainNumber || "---"})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3.5 py-1 text-caption-sm font-bold uppercase tracking-wider ${
                isConfirmed
                  ? "bg-emerald-500 text-white"
                  : isPending
                  ? "bg-amber-500 text-white"
                  : isCancelled
                  ? "bg-rose-600 text-white font-extrabold"
                  : "bg-surface-strong text-ink"
              }`}
            >
              {TICKET_STATUS_LABELS[status] || status}
            </span>
          </div>
        </div>

        {/* Main Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Passenger & Booking Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-hairline pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted block">Passenger Name</span>
              <span className="text-body-md font-bold text-ink block truncate">{bookedByName || "Passenger"}</span>
              {bookedByEmail && <span className="text-caption-sm text-muted block truncate">{bookedByEmail}</span>}
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted block">Ticket Reference</span>
              <span className="text-body-md font-mono font-bold text-ink block">TCK-{ticketId}</span>
              <span className="text-caption-sm text-muted block">Order #{orderId}</span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted block">Journey Date</span>
              <span className="text-body-md font-bold text-ink block">{journeyDate}</span>
              {formattedBookingTime && (
                <span className="text-[11px] text-muted block">Booked: {formattedBookingTime}</span>
              )}
            </div>
          </div>

          {/* Route Section */}
          <div className="rounded-xl border border-hairline bg-surface-soft p-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Origin */}
              <div className="sm:col-span-4 text-left">
                <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider block">Boarding Station</span>
                <span className="text-display-md font-extrabold text-ink font-mono mt-0.5 block">
                  {sourceStationCode || "DEP"}
                </span>
                <span className="text-body-sm font-bold text-ink block">{sourceStationName}</span>
                <span className="text-caption-sm text-muted block">{sourceCity}</span>
                <div className="mt-2 text-caption-sm font-bold text-ink bg-canvas px-2.5 py-1 rounded inline-block border border-hairline">
                  Departs: {depTimeStr}
                </div>
              </div>

              {/* Path Arrow */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center my-2 sm:my-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Direct Route</span>
                <div className="relative flex items-center w-full max-w-[160px]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <span className="h-0.5 flex-1 bg-hairline" />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary -mx-1">
                    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="h-0.5 flex-1 bg-hairline" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
              </div>

              {/* Destination */}
              <div className="sm:col-span-4 text-left sm:text-right">
                <span className="text-[11px] uppercase font-bold text-primary tracking-wider block">Destination Station</span>
                <span className="text-display-md font-extrabold text-ink font-mono mt-0.5 block">
                  {destinationStationCode || "ARR"}
                </span>
                <span className="text-body-sm font-bold text-ink block">{destinationStationName}</span>
                <span className="text-caption-sm text-muted block">{destinationCity}</span>
                <div className="mt-2 text-caption-sm font-bold text-ink bg-canvas px-2.5 py-1 rounded inline-block border border-hairline">
                  Arrives: {arrTimeStr}
                </div>
              </div>
            </div>
          </div>

          {/* Coach & Seat Allocation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-hairline bg-canvas">
            <div>
              <span className="text-[11px] uppercase font-bold text-muted tracking-wider block">Coach</span>
              <span className="text-display-sm font-extrabold text-ink block mt-0.5">
                {coachNumber ? `C${coachNumber}` : "Coach 1"}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-muted tracking-wider block">Seat Number</span>
              <span
                className={`text-display-sm font-extrabold block mt-0.5 ${
                  isCancelled ? "text-rose-600 line-through" : isPending ? "text-amber-600" : "text-primary"
                }`}
              >
                #{seatNumber}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-muted tracking-wider block">Seat Position</span>
              <span className="text-body-md font-bold text-ink block mt-0.5">
                {SEAT_TYPE_LABELS[seatType] || seatType || "Standard"}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase font-bold text-muted tracking-wider block">Fare</span>
              <span className="text-display-sm font-extrabold text-ink block mt-0.5">
                {formattedFare}
              </span>
            </div>
          </div>

          {/* Barcode Strip OR Disabled/Void Indicator */}
          {isConfirmed ? (
            <div className="border-t-2 border-dashed border-hairline pt-6 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center gap-1.5 h-12">
                {[4, 2, 6, 3, 5, 2, 8, 3, 4, 6, 2, 5, 3, 6, 2, 7, 4, 3, 5, 2, 6, 3, 4, 2, 7, 3, 5].map((w, i) => (
                  <span
                    key={i}
                    className="bg-ink h-10 inline-block rounded-xs"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[11px] text-muted tracking-widest uppercase">
                SCAN-REF: TCK-{ticketId}-ORD-{orderId}-{journeyDate?.replace(/-/g, "")}
              </p>
            </div>
          ) : isCancelled ? (
            <div className="border-2 border-dashed border-rose-300 rounded-xl bg-rose-50/60 p-5 text-center space-y-1">
              <span className="text-display-md font-extrabold text-rose-600 font-mono tracking-widest uppercase block">
                VOID · TICKET CANCELLED
              </span>
              <p className="text-[12px] text-rose-700 font-medium">
                This ticket has been cancelled. Boarding gate scan barcode is disabled.
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/60 p-5 text-center space-y-1">
              <span className="text-title-md font-bold text-amber-800 font-mono tracking-wider uppercase block">
                PAYMENT REQUIRED FOR OFFICIAL BOARDING PASS
              </span>
              <p className="text-[12px] text-amber-700 font-medium">
                Official barcode and boarding pass will be issued upon completing checkout.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Print / Actions Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas px-5 py-2.5 text-caption font-bold text-ink hover:bg-surface-soft transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m7 7l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to Bookings</span>
        </button>

        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          {/* Confirmed Tickets: Active Print Button */}
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
              <span>Print Boarding Pass</span>
            </button>
          )}

          {/* Pending Payment Tickets: Complete Payment CTA */}
          {isPending && (
            <Link
              to={`/my-bookings/${orderId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-button-sm font-bold text-white shadow-md hover:bg-primary-active transition-all"
            >
              <span>View Order & Complete Payment</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}

          {/* Cancelled Tickets: Non-printable explanation badge */}
          {isCancelled && (
            <span className="text-caption font-bold text-rose-700 bg-rose-100 px-4 py-2 rounded-sm border border-rose-200">
              Ticket Cancelled — Printing Disabled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
