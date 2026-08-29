import { useCallback, useState } from "react";
import { createBooking } from "../api/bookings";
import { generateIdempotencyKey } from "../utils/bookingUtils";

/**
 * Headless hook to manage ticket reservation and booking order creation logic
 */
export function useBookingOrder() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const executeBooking = useCallback(async ({
    journeyId,
    seatIds,
    sourceStationId,
    destinationStationId,
    idempotencyKey,
  }) => {
    if (!journeyId || !Array.isArray(seatIds) || seatIds.length === 0 || !sourceStationId || !destinationStationId) {
      setBookingError("Missing required booking parameters. Please select seats and stations.");
      return null;
    }

    setIsBooking(true);
    setBookingError("");

    try {
      const order = await createBooking({
        journeyId,
        seatIds,
        sourceStationId,
        destinationStationId,
        idempotencyKey: idempotencyKey || generateIdempotencyKey(),
      });
      setCurrentOrder(order);
      return order;
    } catch (err) {
      const msg = err.message || "Failed to create booking. Please try again.";
      setBookingError(msg);
      setCurrentOrder(null);
      return null;
    } finally {
      setIsBooking(false);
    }
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentOrder(null);
    setBookingError("");
  }, []);

  return {
    currentOrder,
    isBooking,
    bookingError,
    executeBooking,
    resetBooking,
  };
}
