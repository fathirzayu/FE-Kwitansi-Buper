import Axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Bikin instance axios
const axiosInstance = Axios.create({
  baseURL: BASE_URL,
});

// Tambahkan Authorization header otomatis
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tangani error global (token expired, dll)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid / expired
      localStorage.removeItem("token");
      window.location.href = "/login"; // langsung redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
