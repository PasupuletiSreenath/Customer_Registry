import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const data = JSON.parse(localStorage.getItem("auth"));
  if (data?.token) {
    req.headers.Authorization = `Bearer ${data.token}`;
  }
  return req;
});

export default API;