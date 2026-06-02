import { fetchWithAuth, API_URL } from './api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const responsavelService = {
  getPerfil: async () => {
    return fetchWithAuth('/responsaveis/me', { method: 'GET' });
  },

  getAlunosComTurma: async () => {
    return fetchWithAuth('/responsaveis/me/alunos-com-turma', { method: 'GET' });
  },

  updatePerfil: async (data: any) => {
    return fetchWithAuth('/responsaveis/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  atualizarFoto: async (fotoUri: string, mimeType: string, fileName: string) => {
    const formData = new FormData();
    formData.append('foto', {
      uri: fotoUri,
      type: mimeType,
      name: fileName,
    } as any);

    let token = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

    const response = await fetch(`${API_URL}/responsaveis/me/foto`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da foto');
    }
    
    try {
      return await response.json();
    } catch(e) {
      return true;
    }
  },
};
