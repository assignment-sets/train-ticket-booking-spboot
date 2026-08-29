import { useCallback, useEffect, useState } from "react";
import { getTicketById } from "../api/tickets";

const ticketCache = new Map();

export function useTicketDetails(ticketId) {
  const [ticket, setTicket] = useState(ticketId ? ticketCache.get(String(ticketId)) || null : null);
  const [isLoading, setIsLoading] = useState(Boolean(ticketId && !ticketCache.has(String(ticketId))));
  const [error, setError] = useState("");

  const loadTicket = useCallback(
    async ({ force = false } = {}) => {
      if (!ticketId) return null;
      const key = String(ticketId);

      if (!force && ticketCache.has(key)) {
        const cached = ticketCache.get(key);
        setTicket(cached);
        setIsLoading(false);
        return cached;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getTicketById(ticketId);
        if (data) {
          ticketCache.set(key, data);
          setTicket(data);
        }
        return data;
      } catch (err) {
        const msg = err.message || `Failed to load ticket #${ticketId}.`;
        setError(msg);
        setTicket(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [ticketId]
  );

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId, loadTicket]);

  return {
    ticket,
    isLoading,
    error,
    reloadTicket: () => loadTicket({ force: true }),
  };
}
