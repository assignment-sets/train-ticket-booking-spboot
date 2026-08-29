/**
 * Generates a unique UUID v4 idempotency key for booking creation
 * @returns {string}
 */
export function generateIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Extracts hour and minute numbers from either a string ("08:30:00") or a LocalTime object ({ hour: 8, minute: 30 })
 * @param {string|Object} timeValue
 * @returns {{ hour: number, minute: number }|null}
 */
export function parseHourMinute(timeValue) {
  if (!timeValue) return null;

  if (typeof timeValue === "string") {
    const parts = timeValue.split(":");
    if (parts.length >= 2) {
      return {
        hour: Number(parts[0]) || 0,
        minute: Number(parts[1]) || 0,
      };
    }
  }

  if (typeof timeValue === "object") {
    return {
      hour: Number(timeValue.hour) || 0,
      minute: Number(timeValue.minute) || 0,
    };
  }

  return null;
}

/**
 * Normalizes backend time (string or LocalTime object) into "HH:mm" or "hh:mm A"
 * @param {string|Object} localTime - Backend time string ("08:30:00") or object { hour: 8, minute: 30 }
 * @param {Object} [options]
 * @param {boolean} [options.format12h=false] - When true, returns 12-hour format with AM/PM
 * @returns {string} Formatted time string, e.g. "08:30" or "8:30 AM"
 */
export function formatLocalTime(localTime, { format12h = false } = {}) {
  const parsed = parseHourMinute(localTime);
  if (!parsed) return "--:--";

  const { hour, minute } = parsed;

  if (format12h) {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    const m = String(minute).padStart(2, "0");
    return `${h}:${m} ${period}`;
  }

  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Calculates human-readable duration between departure and arrival times
 * @param {string|Object} departureTime
 * @param {string|Object} arrivalTime
 * @returns {string} E.g. "6h 15m" or "45m"
 */
export function calculateDuration(departureTime, arrivalTime) {
  const dep = parseHourMinute(departureTime);
  const arr = parseHourMinute(arrivalTime);
  if (!dep || !arr) return "";

  const depMinutes = dep.hour * 60 + dep.minute;
  let arrMinutes = arr.hour * 60 + arr.minute;

  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60; // Crosses midnight
  }

  const diff = arrMinutes - depMinutes;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Calculates halt / dwell minutes at an intermediate stop
 * @param {string|Object} arrivalTime
 * @param {string|Object} departureTime
 * @returns {string} E.g. "5 mins" or "1 min"
 */
export function calculateHaltMinutes(arrivalTime, departureTime) {
  const arr = parseHourMinute(arrivalTime);
  const dep = parseHourMinute(departureTime);
  if (!arr || !dep) return "";

  const arrMinutes = arr.hour * 60 + arr.minute;
  let depMinutes = dep.hour * 60 + dep.minute;

  if (depMinutes < arrMinutes) {
    depMinutes += 24 * 60;
  }

  const diff = depMinutes - arrMinutes;
  if (diff <= 0) return "";
  return diff === 1 ? "1 min halt" : `${diff} mins halt`;
}

/**
 * Groups raw AvailableSeatResponse[] by coachNumber for structured seat map rendering
 * @param {Array<Object>} [seats=[]]
 * @returns {Object.<number, Array<Object>>} Map of coachNumber to array of seats
 */
export function groupSeatsByCoach(seats = []) {
  if (!Array.isArray(seats)) return {};
  return seats.reduce((acc, seat) => {
    const coach = seat.coachNumber || 1;
    if (!acc[coach]) acc[coach] = [];
    acc[coach].push(seat);
    return acc;
  }, {});
}

/**
 * Formats a numeric price to a localized currency string
 * @param {number|string} amount
 * @param {string} [currency="USD"]
 * @returns {string} Formatted price string, e.g. "$45.00"
 */
export function formatCurrency(amount, currency = "USD") {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(num);
}
