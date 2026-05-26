import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "https://adminback-1.onrender.com/api/",
});

// Attach access token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle token refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await API.post("/token/refresh/", {
          refresh,
        });

        const newAccess = res.data.access;

        // Save new access token
        localStorage.setItem("token", newAccess);

        // Update header and retry original request
        original.headers.Authorization = `Bearer ${newAccess}`;

        return API(original);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;