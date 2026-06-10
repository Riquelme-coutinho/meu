import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoutineScreen } from '../screens/RoutineScreen';
import { EntryExitScreen } from '../screens/EntryExitScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MedicationScreen } from '../screens/MedicationScreen';
import { Platform, Image, TouchableOpacity, Text, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 100, height: 30 }} 
              resizeMode="contain" 
            />
          </View>
        ),
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#0F172A',
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={signOut} 
            style={{ marginRight: 16, backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          >
            <Text style={{ color: '#0284C7', fontWeight: 'bold', fontSize: 14 }}>Sair</Text>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
        },
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Routine') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Medication') {
            // 2. Adicionamos o ícone médico para a nova aba
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'EntryExit') {
            iconName = focused ? 'log-in' : 'log-in-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
        },
        tabBarStyle: { 
          paddingBottom: 8, 
          paddingTop: 8, 
          height: 65,
          borderTopWidth: 0,
          backgroundColor: '#FFFFFF',
          ...Platform.select({
            web: {
              boxShadow: '0px -4px 8px rgba(0,0,0,0.05)',
            },
            default: {
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }
          })
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Início', tabBarLabel: 'Início' }} 
      />
      <Tab.Screen 
        name="Routine" 
        component={RoutineScreen} 
        options={{ title: 'Rotina', tabBarLabel: 'Rotina' }} 
      />
      {/* 3. Colocamos a tela nova no menu inferior (logo após Rotina) */}
      <Tab.Screen 
        name="Medication" 
        component={MedicationScreen} 
        options={{ title: 'Saúde', tabBarLabel: 'Saúde' }} 
      />
      <Tab.Screen 
        name="EntryExit" 
        component={EntryExitScreen} 
        options={{ title: 'Portaria', tabBarLabel: 'Portaria' }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Avisos', tabBarLabel: 'Avisos' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil', tabBarLabel: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
};