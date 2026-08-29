import { useCallback, useEffect, useState } from "react";
import { getOrderById } from "../api/bookings";

const orderCache = new Map();

export function useOrderDetails(orderId) {
  const [order, setOrder] = useState(orderId ? orderCache.get(String(orderId)) || null : null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId && !orderCache.has(String(orderId))));
  const [error, setError] = useState("");

  const loadOrder = useCallback(
    async ({ force = false } = {}) => {
      if (!orderId) return null;
      const key = String(orderId);

      if (!force && orderCache.has(key)) {
        const cached = orderCache.get(key);
        setOrder(cached);
        setIsLoading(false);
        return cached;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getOrderById(orderId);
        if (data) {
          orderCache.set(key, data);
          setOrder(data);
        }
        return data;
      } catch (err) {
        const msg = err.message || `Failed to load order #${orderId}.`;
        setError(msg);
        setOrder(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  return {
    order,
    isLoading,
    error,
    reloadOrder: () => loadOrder({ force: true }),
  };
}
