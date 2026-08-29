import { useEffect, useRef, useState } from "react";
import { useStations } from "../../hooks/useStations";

export default function StationSelect({
  label,
  value,
  onChange,
  placeholder = "Select a station…",
  disabled = false,
}) {
  const { stations, isLoading, filterStations } = useStations();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedStation = stations.find((s) => Number(s.id) === Number(value));
  const filteredStations = filterStations(searchQuery);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  function handleSelect(station) {
    onChange(station.id);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <div className="relative flex flex-col w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && <label className="text-caption text-muted mb-1 font-medium">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-12 w-full rounded-sm border bg-canvas px-3 text-left transition-all flex items-center justify-between gap-2 ${
          isOpen
            ? "border-ink ring-1 ring-ink"
            : "border-hairline hover:border-border-strong hover:bg-surface-soft/50"
        } ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isLoading ? (
          <span className="text-caption text-muted animate-pulse">Loading stations…</span>
        ) : selectedStation ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-caption-sm font-bold text-primary">
              {selectedStation.code}
            </span>
            <div className="flex flex-col truncate">
              <span className="text-body-sm font-medium text-ink truncate leading-tight">
                {selectedStation.name}
              </span>
              <span className="text-[11px] text-muted truncate">
                {selectedStation.city}, {selectedStation.state}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-body-sm text-muted">{placeholder}</span>
        )}

        <svg
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-ink" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 z-50 mt-1.5 rounded-md border border-hairline bg-canvas shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="p-2 border-b border-hairline bg-surface-soft">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, code (e.g. HWH), city…"
                className="h-9 w-full rounded border border-hairline bg-canvas pl-8 pr-3 text-caption text-ink placeholder:text-muted focus:border-ink focus:outline-none"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Station Results List */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-hairline-soft">
            {filteredStations.length === 0 ? (
              <div className="py-6 text-center text-caption text-muted">
                No stations found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredStations.map((st) => {
                const isSelected = Number(st.id) === Number(value);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelect(st)}
                    className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-surface-strong text-ink font-semibold"
                        : "hover:bg-surface-soft text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="shrink-0 rounded bg-surface-strong px-2 py-0.5 font-mono text-caption-sm font-bold text-ink">
                        {st.code}
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="text-body-sm font-medium leading-tight truncate">
                          {st.name}
                        </span>
                        <span className="text-[11px] text-muted truncate">
                          {st.city}, {st.state}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
