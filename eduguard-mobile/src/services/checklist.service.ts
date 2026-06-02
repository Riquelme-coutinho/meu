import { fetchWithAuth } from './api';

export const checklistService = {
  getChecklists: async () => {
    return fetchWithAuth('/checklists/responsaveis/me', { method: 'GET' });
  },
};
