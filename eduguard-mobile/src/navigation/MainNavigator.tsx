import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoutineScreen } from '../screens/RoutineScreen';
import { EntryExitScreen } from '../screens/EntryExitScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Routine') {
            iconName = focused ? 'calendar' : 'calendar-outline';
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
