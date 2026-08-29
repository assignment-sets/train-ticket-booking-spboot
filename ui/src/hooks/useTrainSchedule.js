import { useCallback, useState } from "react";
import { getJourneySchedule, getTrainSchedule } from "../api/trains";

// Module cache for schedule responses
const scheduleCache = new Map();

export function useTrainSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSchedule = useCallback(async ({ journeyId, trainId, force = false } = {}) => {
    const cacheKey = journeyId ? `journey_${journeyId}` : trainId ? `train_${trainId}` : null;
    if (!cacheKey) return null;

    if (!force && scheduleCache.has(cacheKey)) {
      const cached = scheduleCache.get(cacheKey);
      setSchedule(cached);
      setIsLoading(false);
      return cached;
    }

    setIsLoading(true);
    setError("");

    try {
      let data = null;
      if (journeyId) {
        data = await getJourneySchedule(journeyId);
      } else if (trainId) {
        data = await getTrainSchedule(trainId);
      }

      if (data) {
        scheduleCache.set(cacheKey, data);
        setSchedule(data);
      }
      return data;
    } catch (err) {
      const msg = err.message || "Failed to load train route schedule.";
      setError(msg);
      setSchedule(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSchedule = useCallback(() => {
    setSchedule(null);
    setError("");
  }, []);

  return {
    schedule,
    isLoading,
    error,
    fetchSchedule,
    clearSchedule,
  };
}
