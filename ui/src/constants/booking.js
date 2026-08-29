/**
 * @typedef {'WINDOW' | 'MIDDLE' | 'AISLE'} SeatPositionType
 * @typedef {'AVAILABLE' | 'BOOKED'} SeatStatusType
 * @typedef {'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED'} TicketStatusType
 * @typedef {'PENDING' | 'PAID' | 'EXPIRED'} OrderStatusType
 */

/**
 * Seat position types (mirrors OpenAPI enum)
 */
export const SeatType = Object.freeze({
  WINDOW: "WINDOW",
  MIDDLE: "MIDDLE",
  AISLE: "AISLE",
});
export const SEAT_TYPE = SeatType;

export const SEAT_TYPE_LABELS = Object.freeze({
  [SeatType.WINDOW]: "Window",
  [SeatType.MIDDLE]: "Middle",
  [SeatType.AISLE]: "Aisle",
});

/**
 * Seat Status Enum (mirrors AvailableSeatResponse.status: AVAILABLE, BOOKED)
 */
export const SeatStatus = Object.freeze({
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
});
export const SEAT_STATUS = SeatStatus;

export const isSeatAvailable = (status) =>
  (status || "").toUpperCase() === SeatStatus.AVAILABLE;

export const isSeatBooked = (status) =>
  (status || "").toUpperCase() === SeatStatus.BOOKED;

/**
 * Ticket Status Enum (mirrors TicketStatus.java: PENDING_PAYMENT, CONFIRMED, CANCELLED)
 */
export const TicketStatus = Object.freeze({
  PENDING_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
});
export const TICKET_STATUS = TicketStatus;

export const TICKET_STATUS_LABELS = Object.freeze({
  [TicketStatus.PENDING_PAYMENT]: "Pending Payment",
  [TicketStatus.CONFIRMED]: "Confirmed",
  [TicketStatus.CANCELLED]: "Cancelled",
});

/**
 * Order Status Enum (mirrors OrderStatus.java: PENDING, PAID, EXPIRED)
 */
export const OrderStatus = Object.freeze({
  PENDING: "PENDING",
  PAID: "PAID",
  EXPIRED: "EXPIRED",
});
export const ORDER_STATUS = OrderStatus;

export const ORDER_STATUS_LABELS = Object.freeze({
  [OrderStatus.PENDING]: "Pending Payment",
  [OrderStatus.PAID]: "Paid & Confirmed",
  [OrderStatus.EXPIRED]: "Expired / Cancelled",
});

/**
 * Backward-compatible Booking Status enum
 */
export const BOOKING_STATUS = Object.freeze({
  PENDING_PAYMENT: "PENDING",
  COMPLETED: "PAID",
  CANCELLED: "EXPIRED",
  FAILED: "EXPIRED",
});

export const BOOKING_LIMITS = Object.freeze({
  MAX_SEATS_PER_BOOKING: 6,
  MIN_SEATS_PER_BOOKING: 1,
});

/**
 * Ticket State Predicates
 * @param {string} [status]
 * @returns {boolean}
 */
export const isTicketConfirmed = (status) =>
  (status || "").toUpperCase() === TicketStatus.CONFIRMED;

export const isTicketPending = (status) =>
  (status || "").toUpperCase() === TicketStatus.PENDING_PAYMENT;

export const isTicketCancelled = (status) =>
  (status || "").toUpperCase() === TicketStatus.CANCELLED;

/**
 * Order State Predicates
 * @param {string} [status]
 * @returns {boolean}
 */
export const isOrderPaid = (status) => {
  const s = (status || "").toUpperCase();
  return s === OrderStatus.PAID || s === "CONFIRMED" || s === "COMPLETED";
};

export const isOrderPending = (status) => {
  const s = (status || "").toUpperCase();
  return s === OrderStatus.PENDING || s === "PENDING_PAYMENT";
};

export const isOrderExpired = (status) => {
  const s = (status || "").toUpperCase();
  return s === OrderStatus.EXPIRED || s === "CANCELLED";
};
