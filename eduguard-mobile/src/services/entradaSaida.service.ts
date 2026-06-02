import { fetchWithAuth } from './api';

export const entradaSaidaService = {
  getEntradaSaida: async () => {
    return fetchWithAuth('/entradassaidas/responsaveis/me', { method: 'GET' });
  },
};
