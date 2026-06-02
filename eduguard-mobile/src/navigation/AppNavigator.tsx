import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AuthContext } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export const AppNavigator = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {signed ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
