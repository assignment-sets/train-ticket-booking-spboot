import client from "./client";

export async function getMe() {
  const { data } = await client.get("/users/me");
  return data;
}

export async function getAllUsers() {
  const { data } = await client.get("/users");
  return data;
}

export async function getUserById(id) {
  const { data } = await client.get(`/users/${id}`);
  return data;
}

export async function deleteUser(id) {
  const { data } = await client.delete(`/users/${id}`);
  return data;
}
