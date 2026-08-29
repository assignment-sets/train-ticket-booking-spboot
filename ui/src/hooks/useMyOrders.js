import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyOrders } from "../api/bookings";
import { isOrderPaid, isOrderPending, isOrderExpired } from "../constants/booking";

export function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyOrders();
      const orderList = Array.isArray(data) ? data : [];
      // Sort newest orders first
      orderList.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setOrders(orderList);
      return orderList;
    } catch (err) {
      const msg = err.message || "Failed to load your booking orders.";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;

    orders.forEach((o) => {
      if (isOrderPaid(o.status)) {
        confirmed++;
      } else if (isOrderPending(o.status)) {
        pending++;
      } else if (isOrderExpired(o.status)) {
        cancelled++;
      }
    });

    return {
      all: orders.length,
      confirmed,
      pending,
      cancelled,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "ALL") return orders;

    return orders.filter((o) => {
      if (filterStatus === "CONFIRMED" || filterStatus === "PAID") {
        return isOrderPaid(o.status);
      }
      if (filterStatus === "PENDING_PAYMENT" || filterStatus === "PENDING") {
        return isOrderPending(o.status);
      }
      if (filterStatus === "CANCELLED" || filterStatus === "EXPIRED") {
        return isOrderExpired(o.status);
      }
      return true;
    });
  }, [orders, filterStatus]);

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    filterStatus,
    setFilterStatus,
    counts,
    fetchOrders,
  };
}
