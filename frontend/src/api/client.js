import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL + "/api",
});

export const parseAppointment = async ({ mode, text, imageFile }) => {
  const formData = new FormData();
  formData.append("mode", mode);

  if (mode === "text" && text) {
    formData.append("text", text);
  }

  if (mode === "image" && imageFile) {
    formData.append("image", imageFile);
  }

  const { data } = await api.post("/appointments/parse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
