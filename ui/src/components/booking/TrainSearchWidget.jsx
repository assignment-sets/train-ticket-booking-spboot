import { useEffect, useState } from "react";
import StationSelect from "./StationSelect";
import { useStations } from "../../hooks/useStations";

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TrainSearchWidget({ onSearch, isSearching }) {
  const { stations, isLoading: isLoadingStations, error: stationsError } = useStations();
  const [sourceStationId, setSourceStationId] = useState("");
  const [destinationStationId, setDestinationStationId] = useState("");
  const [journeyDate, setJourneyDate] = useState(getTodayString());
  const [validationError, setValidationError] = useState("");

  // Initialize default station selection once station directory loads
  useEffect(() => {
    if (stations && stations.length >= 2) {
      if (!sourceStationId) {
        setSourceStationId(String(stations[0].id));
      }
      if (!destinationStationId) {
        setDestinationStationId(String(stations[1].id));
      }
    }
  }, [stations, sourceStationId, destinationStationId]);

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    const src = Number(sourceStationId);
    const dest = Number(destinationStationId);

    if (!src || !dest) {
      setValidationError("Please select both origin and destination stations.");
      return;
    }

    if (src === dest) {
      setValidationError("Origin and destination stations cannot be the same.");
      return;
    }

    if (!journeyDate) {
      setValidationError("Please select a valid journey date.");
      return;
    }

    onSearch({
      sourceStationId: src,
      destinationStationId: dest,
      journeyDate,
    });
  }

  function handleSwapStations() {
    setSourceStationId(destinationStationId);
    setDestinationStationId(sourceStationId);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-hairline bg-canvas p-4 sm:p-6 shadow-md transition-shadow hover:shadow-lg"
      >
        <div className="flex items-center justify-between mb-4 border-b border-hairline pb-3">
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-ink uppercase tracking-wider">
              Search Train Journeys
            </span>
          </div>
          {stations && stations.length > 0 && (
            <span className="text-caption-sm text-muted font-medium">
              {stations.length} stations available
            </span>
          )}
        </div>

        {stationsError && (
          <div
            role="alert"
            className="mb-4 rounded-sm border border-error/20 bg-error/5 px-4 py-2.5 text-body-sm text-error"
          >
            {stationsError}
          </div>
        )}

        {validationError && (
          <div
            role="alert"
            className="mb-4 rounded-sm border border-error/20 bg-error/5 px-4 py-2.5 text-body-sm text-error"
          >
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin Station */}
          <div className="md:col-span-4 flex flex-col">
            <StationSelect
              label="From Station"
              value={sourceStationId}
              onChange={(id) => setSourceStationId(String(id))}
              placeholder="Select origin station…"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex items-center justify-center pt-5">
            <button
              type="button"
              onClick={handleSwapStations}
              title="Swap Origin & Destination"
              className="h-10 w-10 rounded-full border border-hairline bg-surface-soft hover:bg-surface-strong text-ink flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Destination Station */}
          <div className="md:col-span-4 flex flex-col">
            <StationSelect
              label="To Station"
              value={destinationStationId}
              onChange={(id) => setDestinationStationId(String(id))}
              placeholder="Select destination station…"
            />
          </div>

          {/* Journey Date */}
          <div className="md:col-span-3 flex flex-col">
            <label className="text-caption text-muted mb-1 font-medium">Journey Date</label>
            <input
              type="date"
              min={getTodayString()}
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="h-12 rounded-sm border border-hairline bg-canvas px-3 text-body-md text-ink focus:border-ink focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hairline pt-4">
          {/* Quick Route Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-caption-sm text-muted">
            <span>Popular:</span>
            {stations && stations.length >= 2 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSourceStationId(String(stations[0].id));
                    setDestinationStationId(String(stations[stations.length - 1].id));
                  }}
                  className="rounded-full bg-surface-soft px-2.5 py-1 text-ink hover:bg-surface-strong transition-colors cursor-pointer"
                >
                  {stations[0].code} → {stations[stations.length - 1].code}
                </button>
                {stations.length >= 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSourceStationId(String(stations[0].id));
                      setDestinationStationId(String(stations[2].id));
                    }}
                    className="rounded-full bg-surface-soft px-2.5 py-1 text-ink hover:bg-surface-strong transition-colors cursor-pointer"
                  >
                    {stations[0].code} → {stations[2].code}
                  </button>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || isLoadingStations}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-button-md text-on-primary shadow-sm hover:bg-primary-active transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Searching…</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Search Trains</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
