import { api } from '../api/core.js';

export const Evento = {
  list: async (orderBy = '-data') => {
    const response = await api.get('/eventos', {
      params: { orderBy },
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  create: async (data) => {
    const response = await api.post('/eventos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/eventos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/eventos/${id}`);
    return true;
  },
};
