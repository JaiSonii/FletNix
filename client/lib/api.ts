import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data: any) => api.post('/auth/login', data);
export const registerUser = (data: any) => api.post('/auth/register', data);

export const getShows = (page = 1, type?: string, search?: string) => {
  const params: any = { page };
  if (type && type !== 'All') params.type_filter = type;
  if (search) params.search_query = search;
  return api.get('/shows/', { params });
};

export const getShowDetails = (id: string) => api.get(`/shows/${id}`);
export const getRecommendations = (id: string) => api.get(`/shows/${id}/recommendations`);