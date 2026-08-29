import { useState } from "react";
import { calculateDuration, formatCurrency, formatLocalTime } from "../../utils/bookingUtils";
import { useTrainSchedule } from "../../hooks/useTrainSchedule";
import TrainRouteTimeline from "./TrainRouteTimeline";

export default function TrainResultCard({
  train,
  onSelectSeats,
  isSelected,
  sourceStation,
  destinationStation,
}) {
  const {
    journeyId,
    trainId,
    trainNumber,
    trainName,
    departureTime,
    arrivalTime,
    baseSeatPrice,
  } = train;

  const [showSchedule, setShowSchedule] = useState(false);
  const { schedule, isLoading: isLoadingSchedule, error: scheduleError, fetchSchedule } = useTrainSchedule();

  const depStr = formatLocalTime(departureTime, { format12h: true });
  const arrStr = formatLocalTime(arrivalTime, { format12h: true });
  const durationStr = calculateDuration(departureTime, arrivalTime);
  const formattedPrice = formatCurrency(baseSeatPrice);

  function handleToggleSchedule() {
    const nextState = !showSchedule;
    setShowSchedule(nextState);
    if (nextState && !schedule) {
      fetchSchedule({ journeyId, trainId });
    }
  }

  return (
    <div
      className={`rounded-xl border bg-canvas p-6 transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-hairline hover:border-border-strong hover:shadow-sm"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Train Info */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
              isSelected ? "bg-primary text-white" : "bg-surface-soft text-ink"
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <div className="flex items-center gap-2">
              <h3 className="text-title-md text-ink font-bold">{trainName || "Express Train"}</h3>
              <span className="rounded bg-surface-strong px-2 py-0.5 font-mono text-caption-sm text-ink font-semibold">
                #{trainNumber || journeyId}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-caption-sm text-muted">Journey ID: #{journeyId}</span>
              <span className="text-muted">·</span>
              <button
                type="button"
                onClick={handleToggleSchedule}
                className="text-caption-sm text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{showSchedule ? "Hide Route Stops" : "View Route & Stops"}</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${showSchedule ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="text-left">
            <span className="text-caption-sm text-muted block">Departure</span>
            <span className="text-title-md font-bold text-ink">{depStr}</span>
            {sourceStation && (
              <span className="text-caption-sm font-semibold text-muted block">
                {sourceStation.city} ({sourceStation.code})
              </span>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-caption-sm text-muted mb-1 font-bold">{durationStr}</span>
            <div className="relative flex items-center w-24 sm:w-32">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-0.5 flex-1 bg-hairline" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
            <span className="text-[11px] text-muted font-medium mt-1 uppercase tracking-wider">Direct</span>
          </div>

          <div className="text-right">
            <span className="text-caption-sm text-muted block">Arrival</span>
            <span className="text-title-md font-bold text-ink">{arrStr}</span>
            {destinationStation && (
              <span className="text-caption-sm font-semibold text-muted block">
                {destinationStation.city} ({destinationStation.code})
              </span>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 border-t lg:border-t-0 border-hairline pt-4 lg:pt-0">
          <div>
            <span className="text-caption-sm text-muted block lg:text-right">Starting from</span>
            <span className="text-display-md font-extrabold text-ink">{formattedPrice}</span>
            <span className="text-caption-sm text-muted"> / seat</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectSeats(train)}
            className={`h-11 rounded-sm px-6 text-button-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              isSelected
                ? "bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 shadow-xs"
                : "bg-primary text-white hover:bg-primary-active shadow-sm"
            }`}
          >
            {isSelected ? (
              <>
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Seats Selected</span>
              </>
            ) : (
              <span>Select Seats</span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Route Timeline Drawer */}
      {showSchedule && (
        <TrainRouteTimeline
          schedule={schedule}
          sourceStationId={sourceStation?.id}
          destinationStationId={destinationStation?.id}
          isLoading={isLoadingSchedule}
          error={scheduleError}
        />
      )}
    </div>
  );
}
