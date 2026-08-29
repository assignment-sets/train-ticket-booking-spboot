import { useCallback, useEffect, useState } from "react";
import { getStations } from "../api/stations";

// In-memory module-level cache
let cachedStations = null;
let activeFetchPromise = null;

export function useStations() {
  const [stations, setStations] = useState(cachedStations || []);
  const [isLoading, setIsLoading] = useState(!cachedStations);
  const [error, setError] = useState("");

  const loadStations = useCallback(async ({ force = false } = {}) => {
    if (cachedStations && !force) {
      setStations(cachedStations);
      setIsLoading(false);
      return cachedStations;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!activeFetchPromise || force) {
        activeFetchPromise = getStations();
      }
      const data = await activeFetchPromise;
      const stationList = Array.isArray(data) ? data : [];
      cachedStations = stationList;
      setStations(stationList);
      setIsLoading(false);
      return stationList;
    } catch (err) {
      const msg = err.message || "Failed to load station directory.";
      setError(msg);
      setIsLoading(false);
      return [];
    } finally {
      activeFetchPromise = null;
    }
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const getStation = useCallback(
    (id) => {
      if (!id) return null;
      const numId = Number(id);
      return stations.find((s) => s.id === numId) || null;
    },
    [stations]
  );

  const filterStations = useCallback(
    (query = "") => {
      if (!query || !query.trim()) return stations;
      const clean = query.toLowerCase().trim();
      return stations.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(clean)) ||
          (s.code && s.code.toLowerCase().includes(clean)) ||
          (s.city && s.city.toLowerCase().includes(clean)) ||
          (s.state && s.state.toLowerCase().includes(clean))
      );
    },
    [stations]
  );

  return {
    stations,
    isLoading,
    error,
    reloadStations: () => loadStations({ force: true }),
    getStation,
    getStationById: getStation,
    filterStations,
  };
}
