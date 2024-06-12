import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = 'http://hw-backend-2-1.onrender.com/api/v1/auth';

export const loginUser = async (email: string, password: string): Promise<{ user: User }> => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (username: string, email: string, password: string): Promise<{ user: User }> => {
  const response = await axios.post(`${API_BASE_URL}/register`, { username, email, password });
  return response.data;
};

export const fetchUser = async (): Promise<{ user: User }> => {
  const response = await axios.get(`${API_BASE_URL}/me`);
  return response.data;
};
