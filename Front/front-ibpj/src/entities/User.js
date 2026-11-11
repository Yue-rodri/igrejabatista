import { api, AuthStorage } from '../api/core.js';

export const User = {
  me: async () => {
    await AuthStorage.init();
    if (!AuthStorage.getToken()) {
      return null;
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404)) {
        AuthStorage.clear();
      }
      return null;
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email: email.trim(),
      password,
    });
    AuthStorage.setToken(response.data.token);
    return response.data.user;
  },

  logout: async () => {
    AuthStorage.clear();
    return true;
  },

  list: async () => {
    const response = await api.get('/users/aniversariantes');
    return Array.isArray(response.data) ? response.data : [];
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Falha ao registrar.');
      }
      throw new Error('Não foi possível conectar ao servidor para concluir o cadastro.');
    }
  },

  listAll: async () => {
    const response = await api.get('/users');
    return Array.isArray(response.data) ? response.data : [];
  },

  updateRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    return true;
  },
};
