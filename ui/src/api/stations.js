import client from "./client";

/**
 * Fetch stations list from backend, with optional search query
 * @param {Object} [params]
 * @param {string} [params.search] - Filter by station name, code, or city
 * @returns {Promise<Array<Object>>} Array of StationResponse { id, code, name, city, state }
 */
export async function getStations({ search } = {}) {
  const params = search ? { search } : {};
  const { data } = await client.get("/stations", { params });
  return data;
}

/**
 * Fetch a specific station by ID
 * @param {number|string} id
 * @returns {Promise<Object>} StationResponse { id, code, name, city, state }
 */
export async function getStationById(id) {
  const { data } = await client.get(`/stations/${id}`);
  return data;
}
