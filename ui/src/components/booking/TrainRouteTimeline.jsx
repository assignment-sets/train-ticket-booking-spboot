import { calculateHaltMinutes, formatLocalTime } from "../../utils/bookingUtils";

export default function TrainRouteTimeline({
  schedule,
  sourceStationId,
  destinationStationId,
  isLoading,
  error,
}) {
  if (isLoading) {
    return (
      <div className="py-8 text-center space-y-2 text-caption text-muted animate-pulse">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
        <p>Loading stop-by-stop train schedule…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="my-2 rounded-sm border border-error/20 bg-error/5 p-3 text-caption text-error">
        {error}
      </div>
    );
  }

  if (!schedule || !Array.isArray(schedule.stops) || schedule.stops.length === 0) {
    return (
      <div className="py-6 text-center text-caption text-muted">
        No schedule stops available for this route.
      </div>
    );
  }

  const { stops, routeName, totalCoaches, seatsPerCoach } = schedule;
  const numSrcId = Number(sourceStationId);
  const numDestId = Number(destinationStationId);

  // Find index of origin and destination stops if present
  const srcIdx = stops.findIndex((s) => Number(s.stationId) === numSrcId);
  const destIdx = stops.findIndex((s) => Number(s.stationId) === numDestId);

  return (
    <div className="rounded-lg border border-hairline bg-surface-soft p-4 sm:p-5 mt-4 text-ink animate-in fade-in duration-200">
      {/* Schedule Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-ink">Route Timeline</span>
            {routeName && (
              <span className="rounded bg-canvas border border-hairline px-2 py-0.5 text-caption-sm text-ink font-medium">
                {routeName}
              </span>
            )}
          </div>
          <p className="text-[12px] text-muted mt-0.5">
            {stops.length} scheduled stops across the journey
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted">
          {totalCoaches && (
            <span className="rounded bg-canvas border border-hairline px-2 py-0.5">
              {totalCoaches} Coaches ({totalCoaches * (seatsPerCoach || 18)} seats)
            </span>
          )}
        </div>
      </div>

      {/* Stops Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-4">
        {/* Continuous track line */}
        <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-hairline" />

        {stops.map((stop, idx) => {
          const isOrigin = Number(stop.stationId) === numSrcId;
          const isDestination = Number(stop.stationId) === numDestId;
          const isFirstStop = idx === 0;
          const isLastStop = idx === stops.length - 1;

          // Check if this stop lies between the user's selected route
          const isSegment =
            srcIdx !== -1 &&
            destIdx !== -1 &&
            idx >= Math.min(srcIdx, destIdx) &&
            idx <= Math.max(srcIdx, destIdx);

          const arrFormatted = formatLocalTime(stop.arrivalTime, { format12h: true });
          const depFormatted = formatLocalTime(stop.departureTime, { format12h: true });
          const haltDuration = calculateHaltMinutes(stop.arrivalTime, stop.departureTime);

          return (
            <div key={stop.routeStopId || idx} className="relative flex items-start justify-between gap-4">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[19px] sm:-left-[23px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-canvas transition-colors ${
                  isOrigin
                    ? "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-100"
                    : isDestination
                    ? "border-primary bg-primary ring-4 ring-primary/20"
                    : isSegment
                    ? "border-ink bg-ink"
                    : "border-muted/60 bg-canvas"
                }`}
              >
                {(isOrigin || isDestination) && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>

              {/* Station Info */}
              <div className="flex-1 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-canvas border border-hairline px-1.5 py-0.2 font-mono text-[11px] font-bold text-ink">
                    {stop.stationCode}
                  </span>
                  <span
                    className={`text-body-sm font-medium ${
                      isOrigin || isDestination ? "font-bold text-ink" : "text-ink"
                    }`}
                  >
                    {stop.stationName}
                  </span>

                  {isOrigin && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      Your Boarding Station
                    </span>
                  )}
                  {isDestination && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-bold text-primary uppercase tracking-wide">
                      Your Destination Station
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted mt-0.5">
                  {stop.city}, {stop.state}
                </p>
              </div>

              {/* Stop Timings & Halt */}
              <div className="text-right shrink-0">
                {isFirstStop ? (
                  <div className="text-caption font-semibold text-ink">
                    Departs: <span className="font-bold">{depFormatted}</span>
                  </div>
                ) : isLastStop ? (
                  <div className="text-caption font-semibold text-ink">
                    Arrives: <span className="font-bold">{arrFormatted}</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-caption text-ink">
                      <span className="text-muted text-[11px]">Arr:</span> {arrFormatted} ·{" "}
                      <span className="text-muted text-[11px]">Dep:</span> {depFormatted}
                    </div>
                    {haltDuration && (
                      <span className="inline-block rounded bg-canvas border border-hairline px-1.5 py-0.2 text-[10px] font-medium text-muted mt-0.5">
                        {haltDuration}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
