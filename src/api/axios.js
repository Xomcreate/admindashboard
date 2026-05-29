import axios from "axios";

const API = axios.create({
  baseURL: "https://adminback-1.onrender.com/api/",
});

// Attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Refresh token logic
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
        const res = await axios.post(
          "https://adminback-1.onrender.com/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("token", newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;

        return axios(original);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;