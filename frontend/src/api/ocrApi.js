import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api"
});

export const ocrImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/ocr/image", formData);

  return response.data;
};

export const ocrPdf = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/ocr/pdf", formData);

  return response.data;
};
