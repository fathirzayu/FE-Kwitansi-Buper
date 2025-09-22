import Axios from "axios";


const BASE_URL = process.env.REACT_APP_API_URL;

// Ambil header authorization
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Request keep login
export const keepLoginRequest = async () => {
  try {
    const response = await Axios.get(`${BASE_URL}/api/auth/keeplogin`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Keep login failed:", error);
    throw error;
  }
};

export const fetchKwitansi = async ({ search, sort, order, page, limit, startDate, endDate }) => {
  try {
    const query = new URLSearchParams({
      search,
      sort,
      order,
      page,
      limit,
    });

    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    const res = await Axios.get(`${BASE_URL}/api/kwitansi?${query.toString()}`, {
      headers: getAuthHeader(),
    });

    return res.data;
  } catch (error) {
    console.error("Fetch kwitansi failed:", error);
    return { data: [], totalPages: 1 };
  }
};

export const exportKwitansi = async ({ search, sort, order, startDate, endDate, type }) => {
  try {
    const query = new URLSearchParams({
      search,
      sort,
      order,
      type, // excel / pdf
    });

    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    const res = await Axios.get(`${BASE_URL}/api/kwitansi/export?${query.toString()}`, {
      responseType: "blob", // penting untuk file download
    });

    // Ambil nama file dari Content-Disposition
    const disposition = res.headers["content-disposition"];
    let fileName = "Data_Kwitansi";
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) fileName = match[1];
    }

    // Buat blob dan trigger download
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

// Tambah mahasiswa manual
export const addStudent = async (data) => {
  return Axios.post(`${BASE_URL}/api/mahasiswa/add`, data, { headers: getAuthHeader() });
};

// Upload Excel mahasiswa
export const uploadStudentExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return Axios.post(`${BASE_URL}/api/mahasiswa/upload-excel`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });
};

// Ambil data mahasiswa berdasarkan NIM
export const fetchStudentByNim = async (nim) => {
  const res = await Axios.get(`${BASE_URL}/api/mahasiswa?nim=${nim}`, {
    headers: getAuthHeader(),
  });
  return res.data.data.length ? res.data.data[0] : null;
};

// Submit kwitansi ke backend
export const submitKwitansi = async (data) => {
  return Axios.post(`${BASE_URL}/api/kwitansi/cetak`, data, {
    headers: getAuthHeader(),
  });
};

export const createUser = async (payload) => {
  return Axios.post(`${BASE_URL}/api/auth/register`, payload, {
    headers: getAuthHeader(),
  });
};

export const loginUser = async (payload) => {
  return Axios.post(`${BASE_URL}/api/auth/login`, payload);
};

// Dapatkan URL avatar, pakai default jika kosong
export const getAvatarUrl = (path) => {
  const defaultAvatar = `${BASE_URL}/default-avatar.png`; // letakkan default avatar di server
  if (!path) return defaultAvatar;
  return `${BASE_URL}/${path}`;
};
