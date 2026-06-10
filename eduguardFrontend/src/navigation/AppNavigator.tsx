import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { StaffNavigator } from './StaffNavigator';
import { AuthContext } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { decodeJwt } from '../utils/jwtParser';

export const AppNavigator = () => {
  const { loading, userToken } = useContext(AuthContext);
  const [userType, setUserType] = useState<string | null>(null);
  const [cargo, setCargo] = useState<string>('');

  useEffect(() => {
    if (userToken) {
      const decoded = decodeJwt(userToken);
      if (decoded?.tipo_usuario) {
        setUserType(decoded.tipo_usuario);
      } else {
        setUserType('responsavel');
      }
      if (decoded?.cargo) {
        setCargo(decoded.cargo);
      }
    } else {
      setUserType(null);
      setCargo('');
    }
  }, [userToken]);

  if (loading || (userToken && !userType)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const renderAuthenticatedFlow = () => {
    if (userType === 'diretor') {
      return <StaffNavigator cargo={cargo} />;
    }
    return <MainNavigator />;
  };

  return (
    <NavigationContainer>
      {userToken ? renderAuthenticatedFlow() : <AuthNavigator />}
    </NavigationContainer>
  );
};