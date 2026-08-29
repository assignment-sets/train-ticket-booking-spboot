import client from "./client";

/**
 * Fetch detailed ticket and passenger boarding pass by ticket ID
 * @param {number|string} ticketId
 * @returns {Promise<Object>} TicketDetailResponse
 */
export async function getTicketById(ticketId) {
  const { data } = await client.get(`/tickets/${ticketId}`);
  return data;
}

/**
 * Fetch all tickets owned by the authenticated user
 * @returns {Promise<Array<Object>>} Array of TicketResponse
 */
export async function getMyTickets() {
  const { data } = await client.get("/tickets/my-tickets");
  return data;
}
