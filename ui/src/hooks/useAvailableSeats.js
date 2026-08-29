import { useCallback, useMemo, useState } from "react";
import { getAvailableSeats } from "../api/bookings";
import { BOOKING_LIMITS, isSeatAvailable } from "../constants/booking";

/**
 * Headless hook to manage SeatLayoutResponse, coach switching, and seat selection logic
 */
export function useAvailableSeats() {
  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeatMap, setSelectedSeatMap] = useState(new Map()); // Map of seatId -> seatObject
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [seatError, setSeatError] = useState("");
  const [currentQueryParams, setCurrentQueryParams] = useState(null);

  const fetchSeats = useCallback(async ({ journeyId, sourceStationId, destinationStationId, coachNumber = 1 }) => {
    if (!journeyId || !sourceStationId || !destinationStationId) {
      setSeatError("Journey and station IDs are required to fetch available seats.");
      return null;
    }

    const resolvedCoachNumber = Number(coachNumber || 1);

    setIsLoadingSeats(true);
    setSeatError("");
    setCurrentQueryParams({ journeyId, sourceStationId, destinationStationId });

    try {
      const data = await getAvailableSeats({
        journeyId,
        sourceStationId,
        destinationStationId,
        coachNumber: resolvedCoachNumber,
      });

      // Handle both SeatLayoutResponse object or legacy array format
      if (data && Array.isArray(data.seats)) {
        setSeatLayout(data);
      } else if (Array.isArray(data)) {
        setSeatLayout({
          journeyId,
          totalCoaches: 1,
          seatsPerCoach: data.length,
          currentCoach: resolvedCoachNumber,
          totalAvailableSeats: data.filter((s) => isSeatAvailable(s.status)).length,
          totalBookedSeats: data.filter((s) => !isSeatAvailable(s.status)).length,
          seats: data,
        });
      } else {
        setSeatLayout(null);
      }
      return data;
    } catch (err) {
      const msg = err.message || "Failed to fetch coach seat layout.";
      setSeatError(msg);
      setSeatLayout(null);
      return null;
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  const switchCoach = useCallback(async (coachNumber) => {
    if (!currentQueryParams) return;
    await fetchSeats({
      ...currentQueryParams,
      coachNumber: Number(coachNumber || 1),
    });
  }, [currentQueryParams, fetchSeats]);

  const toggleSeat = useCallback((seatOrId) => {
    setSeatError("");

    let targetSeat = null;
    let seatId = null;

    if (typeof seatOrId === "object" && seatOrId !== null) {
      targetSeat = seatOrId;
      seatId = Number(seatOrId.seatId);
    } else {
      seatId = Number(seatOrId);
      targetSeat = (seatLayout?.seats || []).find((s) => Number(s.seatId) === seatId);
    }

    if (!targetSeat && !selectedSeatMap.has(seatId)) return;

    // Check if the seat is booked (cannot select booked seats)
    if (targetSeat && !isSeatAvailable(targetSeat.status) && !selectedSeatMap.has(seatId)) {
      setSeatError(`Seat #${targetSeat.seatNumber} is already booked.`);
      return;
    }

    setSelectedSeatMap((prev) => {
      const next = new Map(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        if (next.size >= BOOKING_LIMITS.MAX_SEATS_PER_BOOKING) {
          setSeatError(`You can select a maximum of ${BOOKING_LIMITS.MAX_SEATS_PER_BOOKING} seats.`);
          return prev;
        }
        next.set(seatId, targetSeat);
      }
      return next;
    });
  }, [seatLayout, selectedSeatMap]);

  const clearSelectedSeats = useCallback(() => {
    setSelectedSeatMap(new Map());
    setSeatError("");
  }, []);

  const allSeats = useMemo(() => {
    return seatLayout?.seats || [];
  }, [seatLayout]);

  const selectedSeats = useMemo(() => {
    return Array.from(selectedSeatMap.values());
  }, [selectedSeatMap]);

  const selectedSeatIds = useMemo(() => {
    return Array.from(selectedSeatMap.keys());
  }, [selectedSeatMap]);

  const totalSelectedFare = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + (Number(seat.fare) || 0), 0);
  }, [selectedSeats]);

  return {
    seatLayout,
    allSeats,
    totalCoaches: seatLayout?.totalCoaches || 1,
    currentCoach: seatLayout?.currentCoach || 1,
    totalAvailableSeats: seatLayout?.totalAvailableSeats ?? 0,
    totalBookedSeats: seatLayout?.totalBookedSeats ?? 0,
    selectedSeatIds,
    selectedSeats,
    totalSelectedFare,
    isLoadingSeats,
    seatError,
    fetchSeats,
    switchCoach,
    toggleSeat,
    clearSelectedSeats,
  };
}
