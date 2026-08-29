import client from "./client";
import { generateIdempotencyKey } from "../utils/bookingUtils";

/**
 * Search trains by stations and date
 * @param {Object} params
 * @param {number|string} params.sourceStationId (required)
 * @param {number|string} params.destinationStationId (required)
 * @param {string} params.journeyDate (required, YYYY-MM-DD)
 * @returns {Promise<Array<Object>>} Array of TrainSearchResponse
 */
export async function searchTrains({ sourceStationId, destinationStationId, journeyDate }) {
  const { data } = await client.post("/bookings/search", {
    sourceStationId: Number(sourceStationId),
    destinationStationId: Number(destinationStationId),
    journeyDate,
  });
  return data;
}

/**
 * Get seat layout and seat availability for a journey and a specific coach (default coach 1)
 * @param {Object} params
 * @param {number|string} params.journeyId (required, path)
 * @param {number|string} params.sourceStationId (required, query)
 * @param {number|string} params.destinationStationId (required, query)
 * @param {number|string} [params.coachNumber=1] (optional, query)
 * @returns {Promise<Object>} SeatLayoutResponse
 */
export async function getAvailableSeats({ journeyId, sourceStationId, destinationStationId, coachNumber = 1 }) {
  const resolvedCoach = Number(coachNumber || 1);
  const { data } = await client.get(`/bookings/${journeyId}/available-seats`, {
    params: {
      sourceStationId: Number(sourceStationId),
      destinationStationId: Number(destinationStationId),
      coachNumber: resolvedCoach,
    },
  });
  return data;
}

/**
 * Book tickets / create a booking order
 * @param {Object} payload
 * @param {number|string} payload.journeyId (required)
 * @param {Array<number|string>} payload.seatIds (required)
 * @param {number|string} payload.sourceStationId (required)
 * @param {number|string} payload.destinationStationId (required)
 * @param {string} [payload.idempotencyKey] (optional, auto-generated if omitted)
 * @returns {Promise<Object>} BookingOrderResponse
 */
export async function createBooking({
  journeyId,
  seatIds,
  sourceStationId,
  destinationStationId,
  idempotencyKey,
}) {
  const { data } = await client.post("/bookings", {
    journeyId: Number(journeyId),
    seatIds: Array.isArray(seatIds) ? seatIds.map(Number) : [],
    sourceStationId: Number(sourceStationId),
    destinationStationId: Number(destinationStationId),
    idempotencyKey: idempotencyKey || generateIdempotencyKey(),
  });
  return data;
}

/**
 * Fetch all booking orders with passenger tickets for the authenticated user
 * @returns {Promise<Array<Object>>} Array of BookingOrderResponse
 */
export async function getMyOrders() {
  const { data } = await client.get("/bookings/my-orders");
  return data;
}

/**
 * Fetch a specific booking order receipt by ID
 * @param {number|string} orderId
 * @returns {Promise<Object>} BookingOrderResponse
 */
export async function getOrderById(orderId) {
  const { data } = await client.get(`/bookings/orders/${orderId}`);
  return data;
}
