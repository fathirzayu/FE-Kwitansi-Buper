import axiosInstance from "./axiosInstance";

// Ambil header authorization
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Request keep login
export const keepLoginRequest = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/keeplogin");
    return response.data;
  } catch (error) {
    console.error("Keep login failed:", error);
    throw error;
  }
};

export const fetchKwitansi = async ({ search, sort, order, page, limit, startDate, endDate }) => {
  try {
    const query = new URLSearchParams({ search, sort, order, page, limit });
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    const res = await axiosInstance.get(`/api/kwitansi?${query.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch kwitansi failed:", error);
    return { data: [], totalPages: 1 };
  }
};

export const exportKwitansi = async ({ search, sort, order, startDate, endDate, type }) => {
  try {
    const query = new URLSearchParams({ search, sort, order, type });
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    const res = await axiosInstance.get(`/api/kwitansi/export?${query.toString()}`, {
      responseType: "blob",
    });

    const disposition = res.headers["content-disposition"];
    let fileName = "Data_Kwitansi";
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) fileName = match[1];
    }

    const blob = new Blob([res.data], { type: res.headers["content-type"] });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("exportKwitansi error:", error);
    throw error;
  }
};

export const addStudent = async (data) => {
  return axiosInstance.post("/api/mahasiswa/add", data);
};

export const uploadStudentExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/api/mahasiswa/upload-excel", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchStudentByNim = async (nim) => {
  const res = await axiosInstance.get(`/api/mahasiswa?nim=${nim}`);
  return res.data.data.length ? res.data.data[0] : null;
};

export const submitKwitansi = async (data) => {
  return axiosInstance.post("/api/kwitansi/cetak", data);
};

export const createUser = async (payload) => {
  return axiosInstance.post("/api/auth/register", payload);
};

// Login biasanya tanpa token
export const loginUser = async (payload) => {
  return axiosInstance.post("/api/auth/login", payload, { headers: {} });
};

// Dapatkan URL avatar, pakai default jika kosong
export const getAvatarUrl = (path) => {
  const defaultAvatar = "/default-avatar.png"; // letakkan default avatar di public folder
  return path ? `${process.env.REACT_APP_API_URL}/${path}` : defaultAvatar;
};