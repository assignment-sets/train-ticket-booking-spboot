import { useCallback, useState } from "react";
import { searchTrains } from "../api/bookings";

/**
 * Headless hook to manage train searching logic and state
 */
export function useTrainSearch() {
  const [trains, setTrains] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [lastSearchParams, setLastSearchParams] = useState(null);

  const executeSearch = useCallback(async ({ sourceStationId, destinationStationId, journeyDate }) => {
    if (!sourceStationId || !destinationStationId || !journeyDate) {
      setSearchError("Please select source station, destination station, and journey date.");
      return [];
    }

    setIsSearching(true);
    setSearchError("");
    const params = { sourceStationId, destinationStationId, journeyDate };
    setLastSearchParams(params);

    try {
      const results = await searchTrains(params);
      const formattedResults = Array.isArray(results) ? results : [];
      setTrains(formattedResults);
      return formattedResults;
    } catch (err) {
      const msg = err.message || "Failed to search trains. Please try again.";
      setSearchError(msg);
      setTrains([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setTrains([]);
    setSearchError("");
    setLastSearchParams(null);
  }, []);

  return {
    trains,
    isSearching,
    searchError,
    lastSearchParams,
    executeSearch,
    resetSearch,
  };
}
