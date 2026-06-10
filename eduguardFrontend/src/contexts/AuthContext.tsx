import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { api, registerSignOut } from '../services/api';

const ACCESS_TOKEN_KEY = 'eduguard_access_token';

interface AuthContextData {
  signed: boolean;
  userToken: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    // 1. Immediately kill local state to push user to Login Screen
    setUserToken(null);
    setLoading(false);

    // 2. Safely attempt to clear storage without blocking the UI
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Falha ao remover o token seguro:', error);
    }
  };

  // Register synchronously during render so the interceptor has it immediately, avoiding race conditions
  registerSignOut(signOut);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        let token = null;
        if (Platform.OS === 'web') {
          token = localStorage.getItem(ACCESS_TOKEN_KEY);
        } else {
          token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        }
        
        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.error('Falha ao recuperar o token seguro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (token: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      }
      setUserToken(token);
    } catch (error) {
      console.error('Falha ao salvar o token seguro:', error);
      throw new Error('Não foi possível salvar a sessão.');
    }
  };



  return (
    <AuthContext.Provider value={{ signed: !!userToken, userToken, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
