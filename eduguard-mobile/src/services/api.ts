export const API_URL = "http://192.168.0.100:3000";

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  let token = null;
  if (Platform.OS === 'web') {
    token = localStorage.getItem('userToken');
  } else {
    token = await SecureStore.getItemAsync('userToken');
  }

  const headers: HeadersInit = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'Erro na requisição';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Ignora erro se não for JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
};
