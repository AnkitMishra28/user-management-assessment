import apiClient from './client';

/**
 * Authentication API calls
 */

export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return response.data;
  },

  // Register (Admin only)
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // Update current profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/me', profileData);
    return response.data;
  },
};

/**
 * User management API calls
 */

export const userAPI = {
  // Get all users
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const response = await apiClient.get(`/users?${params}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, updateData) => {
    const response = await apiClient.put(`/users/${id}`, updateData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },
};

export default {
  auth: authAPI,
  users: userAPI,
};
