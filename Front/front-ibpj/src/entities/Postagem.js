import { api } from '../api/core.js';

export const Postagem = {
  list: async () => {
    const response = await api.get('/postagens');
    return Array.isArray(response.data) ? response.data : [];
  },

  create: async (data) => {
    const response = await api.post('/postagens', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/postagens/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/postagens/${id}`);
    return true;
  },
};
