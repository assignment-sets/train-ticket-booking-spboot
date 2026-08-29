import { formatCurrency } from "../../utils/bookingUtils";
import { SEAT_TYPE_LABELS } from "../../constants/booking";

export default function BookingCheckoutDrawer({
  train,
  selectedSeats = [],
  searchParams,
  sourceStation,
  destinationStation,
  onProceedToPayment,
  onClearSeats,
  onRemoveSeat,
  isBooking,
  error,
}) {
  if (!train || selectedSeats.length === 0) {
    return null;
  }

  const defaultBasePrice = Number(train.baseSeatPrice) || 0;
  const totalPrice = selectedSeats.reduce(
    (sum, s) => sum + (s.fare != null ? Number(s.fare) : defaultBasePrice),
    0
  );
  const formattedTotal = formatCurrency(totalPrice);

  const routeLabel =
    sourceStation && destinationStation
      ? `${sourceStation.city} (${sourceStation.code}) → ${destinationStation.city} (${destinationStation.code})`
      : null;

  return (
    <aside
      aria-label="Booking summary and checkout"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-hairline bg-canvas/98 backdrop-blur-xl p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Summary & Selected Seat Tags */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-title-sm font-bold text-ink">
              {train.trainName} (#{train.trainNumber})
            </span>
            {routeLabel && (
              <span className="text-caption-sm font-bold text-ink bg-surface-strong px-2.5 py-0.5 rounded-full border border-hairline">
                {routeLabel}
              </span>
            )}
            <span className="text-caption-sm text-muted font-medium">
              · Date: {searchParams?.journeyDate}
            </span>
            <button
              type="button"
              onClick={onClearSeats}
              disabled={isBooking}
              className="text-caption-sm text-muted hover:text-error underline ml-2 transition-colors cursor-pointer font-medium"
            >
              Clear All ({selectedSeats.length})
            </button>
          </div>

          {/* Selected Seat Chips with individual seat pricing & instant removal */}
          <div className="flex flex-wrap items-center gap-2 max-h-16 overflow-y-auto py-0.5">
            {selectedSeats.map((s) => (
              <span
                key={s.seatId}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft border border-hairline px-3 py-1 text-caption-sm text-ink shadow-2xs font-semibold"
              >
                <span>Coach {s.coachNumber} · #{s.seatNumber}</span>
                <span className="text-muted text-[11px]">({SEAT_TYPE_LABELS[s.seatType] || s.seatType})</span>
                {s.fare != null && (
                  <span className="font-mono text-primary text-[12px] font-bold">
                    {formatCurrency(s.fare)}
                  </span>
                )}
                {onRemoveSeat && (
                  <button
                    type="button"
                    onClick={() => onRemoveSeat(s.seatId)}
                    title={`Remove seat #${s.seatNumber}`}
                    className="h-4 w-4 rounded-full bg-surface-strong hover:bg-error hover:text-white flex items-center justify-center text-[10px] text-muted transition-colors cursor-pointer ml-0.5"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {error && (
            <p className="text-body-sm text-error mt-2 font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* Right: Price calculation & Action Button */}
        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-hairline pt-3 md:pt-0">
          <div className="text-left md:text-right">
            <span className="text-caption-sm text-muted block font-medium">
              {selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"} selected
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-caption font-semibold text-muted">Total:</span>
              <span className="text-display-md font-extrabold text-ink">{formattedTotal}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToPayment}
            disabled={isBooking}
            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-sm bg-primary px-8 text-button-md font-bold text-white shadow-md hover:bg-primary-active active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isBooking ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-white">Connecting to Stripe…</span>
              </>
            ) : (
              <>
                <span className="text-white">Proceed to Payment</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                  <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
