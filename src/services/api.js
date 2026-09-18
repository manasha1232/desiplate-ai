import axios from 'axios';

const API_BASE = '/api';

export const analyzeMeal = async (file = null, sampleFilename = null) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  
  let url = `${API_BASE}/analyze`;
  if (sampleFilename) {
    url += `?sample_filename=${encodeURIComponent(sampleFilename)}`;
  }
  
  const response = await axios.post(url, file ? formData : null, {
    headers: file ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
};

export const getSampleImages = async () => {
  const response = await axios.get(`${API_BASE}/sample-images`);
  return response.data;
};

export const getMealHistory = async () => {
  const response = await axios.get(`${API_BASE}/meals`);
  return response.data;
};

export const getMealStats = async () => {
  const response = await axios.get(`${API_BASE}/meals/stats`);
  return response.data;
};

export const getMealDetails = async (mealId) => {
  const response = await axios.get(`${API_BASE}/meals/${mealId}`);
  return response.data;
};

export const getEvaluationData = async () => {
  const response = await axios.get(`${API_BASE}/evaluate`);
  return response.data;
};
