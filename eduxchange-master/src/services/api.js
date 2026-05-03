import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("loggedInUser");
  console.log("RAW USER:", raw);

  const user = JSON.parse(raw);
  console.log("PARSED USER:", user);

  if (user && user.token) {
    console.log("TOKEN SENT:", user.token);
    config.headers.Authorization = `Bearer ${user.token}`;
  } else {
    console.log("NO TOKEN FOUND ❌");
  }

  return config;
});


export default api;
