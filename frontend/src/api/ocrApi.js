import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const ocrImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/ocr/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};

export const ocrPdf = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/ocr/pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};