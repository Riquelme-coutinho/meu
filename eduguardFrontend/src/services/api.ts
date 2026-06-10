import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.15.7:3000';
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let globalSignOut: (() => void) | null = null;

export const registerSignOut = (signOutFn: () => void) => {
  globalSignOut = signOutFn;
};

api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('eduguard_access_token');
      } else {
        token = await SecureStore.getItemAsync('eduguard_access_token');
      }
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 1. Direct Fallback: Proactively wipe the tokens at the lowest level
      try {
        if (Platform.OS === 'web') {
          localStorage.removeItem('eduguard_access_token');
        } else {
          await SecureStore.deleteItemAsync('eduguard_access_token');
        }
      } catch (e) {
        console.error('Falha ao forçar limpeza do token no interceptor', e);
      }
      
      // 2. Trigger React State updates
      if (globalSignOut) {
        globalSignOut();
      } else {
        // 3. Last Resort: If state trigger failed/unmounted and we are on Web, force full reload
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.reload();
        }
      }
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
