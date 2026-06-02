import { fetchWithAuth } from './api';

export const notificacaoService = {
  getNotificacoes: async () => {
    return fetchWithAuth('/notificacoes', { method: 'GET' });
  },
  
  getContadorNaoLidas: async () => {
    return fetchWithAuth('/notificacoes/nao-lidas', { method: 'GET' });
  },

  marcarComoVisualizada: async (id: number) => {
    return fetchWithAuth(`/notificacoes/${id}/visualizar`, { method: 'PATCH' });
  },
};
