import axios from "axios";
import { getToken } from "../lib/auth";

const client = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message =
      data?.message ??
      (status === 403
        ? "You do not have permission to perform this action."
        : status === 404
          ? "The requested resource was not found."
          : status === 409
            ? "The request conflicts with the current state of the server."
            : "Something went wrong. Please try again.");

    const apiError = new Error(message);
    apiError.status = status;
    apiError.code = data?.error;
    throw apiError;
  },
);

export default client;
