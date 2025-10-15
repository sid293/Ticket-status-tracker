import axios from 'axios';
import { getToken, setToken, removeToken } from '../utils/auth.js';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { name, email, password });
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Ticket API functions
export const getAllTickets = async () => {
  try {
    const response = await api.get('/api/tickets');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tickets' };
  }
};

export const createTicket = async (title, description) => {
  try {
    const response = await api.post('/api/tickets', { title, description });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create ticket' };
  }
};

export const getTicketHistory = async (id) => {
  try {
    const response = await api.get(`/api/tickets/${id}/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch ticket history' };
  }
};

export const updateTicketStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/tickets/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update ticket status' };
  }
};

export const updateTicket = async (id, title, description) => {
  try {
    const response = await api.put(`/api/tickets/${id}`, { title, description });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update ticket' };
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await api.delete(`/api/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete ticket' };
  }
};

export const getTicket = async (id) => {
  try {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch ticket' };
  }
};

export const logout = () => {
  removeToken();
};
