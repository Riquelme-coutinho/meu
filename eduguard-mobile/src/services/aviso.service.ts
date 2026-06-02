import { fetchWithAuth } from './api';

export const avisoService = {
  getAvisos: async () => {
    return fetchWithAuth('/avisos/responsaveis/me', { method: 'GET' });
  },
};
