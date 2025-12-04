import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export const parseAppointment = async ({ mode, text, imageFile }) => {
  const formData = new FormData();
  formData.append('mode', mode);
  if (mode === 'text' && text) {
    formData.append('text', text);
  }
  if (mode === 'image' && imageFile) {
    formData.append('image', imageFile);
  }

  const { data } = await api.post('/appointments/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const getAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};
