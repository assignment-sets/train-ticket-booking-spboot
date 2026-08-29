import { useMemo } from "react";
import { BOOKING_LIMITS, SEAT_TYPE_LABELS, isSeatBooked } from "../../constants/booking";
import { formatCurrency } from "../../utils/bookingUtils";

export default function SeatMapPicker({
  train,
  allSeats = [],
  totalCoaches = 1,
  currentCoach = 1,
  totalAvailableSeats = 0,
  totalBookedSeats = 0,
  selectedSeatIds = [],
  onToggleSeat,
  onSwitchCoach,
  isLoading,
  error,
}) {
  const coachList = useMemo(() => {
    const count = Math.max(Number(totalCoaches) || 1, 1);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [totalCoaches]);

  // Partition current coach seats into 3+3 layout:
  // Left 3 seats: Window -> Middle -> Aisle (e.g. #1, #2, #3)
  // Right 3 seats: Aisle -> Middle -> Window (e.g. #6, #5, #4)
  const rows = useMemo(() => {
    const sorted = [...allSeats].sort((a, b) => (Number(a.seatNumber) || 0) - (Number(b.seatNumber) || 0));
    const rowList = [];
    for (let i = 0; i < sorted.length; i += 6) {
      const leftSeats = sorted.slice(i, i + 3);
      // Reverse right side so Aisle is adjacent to the walkway and Window is on the outer right wall
      const rightSeats = sorted.slice(i + 3, i + 6).reverse();
      rowList.push({
        rowNumber: Math.floor(i / 6) + 1,
        leftSeats,
        rightSeats,
      });
    }
    return rowList;
  }, [allSeats]);

  const selectedInThisCoach = allSeats.filter(
    (s) => selectedSeatIds.includes(s.seatId) && !isSeatBooked(s.status)
  );
  const coachSelectedTotal = selectedInThisCoach.reduce(
    (sum, s) => sum + (Number(s.fare) || Number(train?.baseSeatPrice) || 0),
    0
  );

  return (
    <div className="rounded-xl border border-hairline bg-canvas p-5 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-display-md text-ink font-bold">Select Your Seats</h3>
            <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-0.5 rounded-full text-caption font-bold">
              Coach {currentCoach} of {totalCoaches}
            </span>
          </div>
          <p className="text-body-sm text-muted mt-1">
            {train?.trainName} (#{train?.trainNumber}) · Max {BOOKING_LIMITS.MAX_SEATS_PER_BOOKING} seats per reservation
          </p>
        </div>

        {/* Selected count pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-surface-soft border border-hairline px-4 py-1.5 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                selectedSeatIds.length > 0 ? "bg-primary animate-pulse" : "bg-muted"
              }`}
            />
            <span className="text-caption font-bold text-ink">
              {selectedSeatIds.length} / {BOOKING_LIMITS.MAX_SEATS_PER_BOOKING} selected
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-md border border-error/20 bg-error/5 p-3 text-body-sm text-error font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
          <p className="text-body-md text-muted font-medium">Loading coach #{currentCoach} seat layout…</p>
        </div>
      ) : allSeats.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-hairline rounded-xl p-8">
          <p className="text-body-md text-muted font-medium">No seat layout data available for this journey.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Coach Switcher Bar */}
          {coachList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-caption font-bold text-muted shrink-0 mr-1">Select Coach:</span>
              {coachList.map((coachNum) => {
                const isCurrent = currentCoach === coachNum;
                return (
                  <button
                    key={coachNum}
                    type="button"
                    onClick={() => onSwitchCoach && onSwitchCoach(coachNum)}
                    className={`h-10 px-4 rounded-full text-caption font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                      isCurrent
                        ? "bg-ink text-white shadow-md ring-2 ring-ink/20 scale-102"
                        : "bg-surface-soft text-ink hover:bg-surface-strong border border-hairline"
                    }`}
                  >
                    <span>Coach {coachNum}</span>
                    {isCurrent && (
                      <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                        {totalAvailableSeats} free
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Seat Map Legend & Coach Capacity Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-6 rounded-lg bg-surface-soft border border-hairline text-caption font-medium">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md border-2 border-border-strong bg-canvas inline-block shadow-2xs" />
                <span className="text-ink font-semibold">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-primary inline-block shadow-sm ring-2 ring-primary/20" />
                <span className="text-ink font-bold">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md border-2 border-dashed border-hairline bg-surface-strong opacity-70 inline-block" />
                <span className="text-muted font-semibold">Booked / Occupied</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-caption-sm text-muted">
              <span>Coach {currentCoach}: <strong className="text-ink">{totalAvailableSeats} Available</strong> · <span className="text-rose-600">{totalBookedSeats} Booked</span></span>
            </div>
          </div>

          {/* 3 + 3 Realistic Train Compartment Layout */}
          <div className="max-w-3xl mx-auto rounded-2xl border-2 border-hairline bg-surface-soft p-5 sm:p-7 shadow-inner relative overflow-hidden">
            {/* Front of Train indicator */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-hairline">
              <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-muted">
                <span>← Engine / Front Direction</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-semibold text-muted">
                  🪟 Window on outer sides
                </span>
                <span className="text-caption font-bold text-ink bg-canvas px-3 py-1 rounded-full border border-hairline shadow-2xs">
                  Coach {currentCoach}
                </span>
              </div>
            </div>

            {/* Rows with Central Walking Aisle */}
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.rowNumber} className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Left Column (3 seats: Window, Middle, Aisle) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
                    {row.leftSeats.map((seat) => {
                      const isBooked = isSeatBooked(seat.status);
                      const isSelected = selectedSeatIds.includes(seat.seatId);
                      const typeLabel = SEAT_TYPE_LABELS[seat.seatType] || seat.seatType || "Seat";
                      const seatPrice = seat.fare != null ? formatCurrency(seat.fare) : "";

                      if (isBooked) {
                        return (
                          <button
                            key={seat.seatId}
                            type="button"
                            disabled
                            title={`Seat #${seat.seatNumber} (${typeLabel}) is already booked`}
                            className="relative flex flex-col items-center justify-between h-22 w-14 sm:w-20 rounded-xl p-1.5 sm:p-2 bg-surface-strong/70 border-2 border-dashed border-hairline text-muted cursor-not-allowed opacity-65 select-none"
                          >
                            <div className="h-2 w-8 sm:w-12 rounded-t-md -mt-1 bg-surface-strong" />
                            <span className="text-body-sm sm:text-body-md font-bold text-muted line-through">
                              #{seat.seatNumber}
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tight text-rose-700 bg-rose-100/90 px-1 py-0.2 rounded-xs">
                              Booked
                            </span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={seat.seatId}
                          type="button"
                          onClick={() => onToggleSeat(seat)}
                          title={`Seat #${seat.seatNumber} (${typeLabel}) - ${seatPrice}`}
                          className={`relative flex flex-col items-center justify-between h-22 w-14 sm:w-20 rounded-xl p-1.5 sm:p-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white border-2 border-primary shadow-lg ring-4 ring-primary/25 scale-105"
                              : "bg-canvas border-2 border-hairline text-ink hover:border-ink hover:shadow-md hover:scale-102"
                          }`}
                        >
                          {/* Seat Headrest */}
                          <div
                            className={`h-2 w-8 sm:w-12 rounded-t-md -mt-1 ${
                              isSelected ? "bg-white/40" : "bg-surface-strong"
                            }`}
                          />

                          {/* Seat Number */}
                          <span
                            className={`text-body-sm sm:text-body-md font-bold leading-tight ${
                              isSelected ? "text-white" : "text-ink"
                            }`}
                          >
                            #{seat.seatNumber}
                          </span>

                          {/* Seat Type & Price Tag */}
                          <div className="flex flex-col items-center leading-none">
                            <span
                              className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-tight ${
                                isSelected ? "text-white/90" : "text-muted"
                              }`}
                            >
                              {typeLabel}
                            </span>
                            {seatPrice && (
                              <span
                                className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 ${
                                  isSelected ? "text-white font-mono" : "text-ink font-mono"
                                }`}
                              >
                                {seatPrice}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Central Walking Aisle */}
                  <div className="shrink-0 w-6 sm:w-10 text-center py-2">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-soft tracking-widest block rotate-90 sm:rotate-0">
                      AISLE
                    </span>
                  </div>

                  {/* Right Column (3 seats: Aisle, Middle, Window) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-start">
                    {row.rightSeats.map((seat) => {
                      const isBooked = isSeatBooked(seat.status);
                      const isSelected = selectedSeatIds.includes(seat.seatId);
                      const typeLabel = SEAT_TYPE_LABELS[seat.seatType] || seat.seatType || "Seat";
                      const seatPrice = seat.fare != null ? formatCurrency(seat.fare) : "";

                      if (isBooked) {
                        return (
                          <button
                            key={seat.seatId}
                            type="button"
                            disabled
                            title={`Seat #${seat.seatNumber} (${typeLabel}) is already booked`}
                            className="relative flex flex-col items-center justify-between h-22 w-14 sm:w-20 rounded-xl p-1.5 sm:p-2 bg-surface-strong/70 border-2 border-dashed border-hairline text-muted cursor-not-allowed opacity-65 select-none"
                          >
                            <div className="h-2 w-8 sm:w-12 rounded-t-md -mt-1 bg-surface-strong" />
                            <span className="text-body-sm sm:text-body-md font-bold text-muted line-through">
                              #{seat.seatNumber}
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tight text-rose-700 bg-rose-100/90 px-1 py-0.2 rounded-xs">
                              Booked
                            </span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={seat.seatId}
                          type="button"
                          onClick={() => onToggleSeat(seat)}
                          title={`Seat #${seat.seatNumber} (${typeLabel}) - ${seatPrice}`}
                          className={`relative flex flex-col items-center justify-between h-22 w-14 sm:w-20 rounded-xl p-1.5 sm:p-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white border-2 border-primary shadow-lg ring-4 ring-primary/25 scale-105"
                              : "bg-canvas border-2 border-hairline text-ink hover:border-ink hover:shadow-md hover:scale-102"
                          }`}
                        >
                          {/* Seat Headrest */}
                          <div
                            className={`h-2 w-8 sm:w-12 rounded-t-md -mt-1 ${
                              isSelected ? "bg-white/40" : "bg-surface-strong"
                            }`}
                          />

                          {/* Seat Number */}
                          <span
                            className={`text-body-sm sm:text-body-md font-bold leading-tight ${
                              isSelected ? "text-white" : "text-ink"
                            }`}
                          >
                            #{seat.seatNumber}
                          </span>

                          {/* Seat Type & Price Tag */}
                          <div className="flex flex-col items-center leading-none">
                            <span
                              className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-tight ${
                                isSelected ? "text-white/90" : "text-muted"
                              }`}
                            >
                              {typeLabel}
                            </span>
                            {seatPrice && (
                              <span
                                className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 ${
                                  isSelected ? "text-white font-mono" : "text-ink font-mono"
                                }`}
                              >
                                {seatPrice}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Back of Train indicator */}
            <div className="pt-6 mt-6 border-t-2 border-dashed border-hairline text-center text-caption-sm text-muted font-medium">
              Rear of Coach {currentCoach}
            </div>
          </div>

          {/* Selected Seat Quick Summary */}
          {selectedInThisCoach.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-surface-soft border border-hairline text-caption">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted font-medium">Selected in Coach {currentCoach}:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedInThisCoach.map((s) => (
                    <span
                      key={s.seatId}
                      className="inline-flex items-center gap-1 bg-canvas border border-hairline rounded-full px-2.5 py-0.5 text-caption-sm font-bold text-ink"
                    >
                      <span>#{s.seatNumber} ({SEAT_TYPE_LABELS[s.seatType] || s.seatType})</span>
                      {s.fare != null && <span className="text-primary font-mono">{formatCurrency(s.fare)}</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-caption font-bold text-ink">
                Coach Subtotal: <span className="text-primary">{formatCurrency(coachSelectedTotal)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
