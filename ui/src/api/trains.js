import client from "./client";

/**
 * Fetch all registered trains
 * @returns {Promise<Array<Object>>} Array of TrainResponse
 */
export async function getAllTrains() {
  const { data } = await client.get("/trains");
  return data;
}

/**
 * Fetch specific train details by ID
 * @param {number|string} id
 * @returns {Promise<Object>} TrainResponse
 */
export async function getTrainById(id) {
  const { data } = await client.get(`/trains/${id}`);
  return data;
}

/**
 * Fetch train schedule by train ID
 * @param {number|string} trainId
 * @returns {Promise<Object>} TrainScheduleResponse
 */
export async function getTrainSchedule(trainId) {
  const { data } = await client.get(`/trains/${trainId}/schedule`);
  return data;
}

/**
 * Fetch train schedule by journey ID
 * @param {number|string} journeyId
 * @returns {Promise<Object>} TrainScheduleResponse
 */
export async function getJourneySchedule(journeyId) {
  const { data } = await client.get(`/trains/journeys/${journeyId}/schedule`);
  return data;
}
