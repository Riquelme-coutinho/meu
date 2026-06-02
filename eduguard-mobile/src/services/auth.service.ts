import { fetchWithAuth } from './api';

export const authService = {
  login: async (cpf: string, senhaacesso: string) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cpf, senhaacesso }),
    });
  },
};
