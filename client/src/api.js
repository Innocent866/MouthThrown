import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('mt-user'))?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* no stored user */ }
  return config;
});

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export const errMsg = (e, fallback = 'Something went wrong') =>
  e?.response?.data?.message || e?.message || fallback;
