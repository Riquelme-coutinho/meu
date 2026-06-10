import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { DashboardScreen } from '../screens/admin/DashboardScreen';
import { AdminNoticesScreen } from '../screens/admin/AdminNoticesScreen';
import { StaffManagementScreen } from '../screens/admin/StaffManagementScreen';
import { AuditLogsScreen } from '../screens/admin/AuditLogsScreen';
import { AttendanceScreen } from '../screens/admin/AttendanceScreen';
import { AdminAlunosScreen } from '../screens/admin/AdminAlunosScreen';
import { AdminFamiliasScreen } from '../screens/admin/AdminFamiliasScreen';
import { AdminTurmasScreen } from '../screens/admin/AdminTurmasScreen';
import { AdminRotinaScreen } from '../screens/admin/AdminRotinaScreen';


const Tab = createBottomTabNavigator();

const RoleConfig: Record<string, string[]> = {
  Dashboard: ['Diretor'],
  Frequencia: ['Diretor', 'Porteiro'],
  Avisos: ['Diretor', 'Professor', 'Secretario'],
  Equipe: ['Diretor'],
  Auditoria: ['Diretor', 'Secretario'],
  Alunos: ['Diretor', 'Porteiro', 'Professor', 'Secretario', 'Coordenador'],
  Familias: ['Diretor', 'Porteiro', 'Professor'],
  Turmas: ['Diretor'],
  Rotina: ['Diretor', 'Professor'],
  Medicacao: ['Diretor', 'Professor'],
};

interface StaffNavigatorProps {
  cargo: string;
}

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: any = 'home';
          if (route.name === 'Dashboard') iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Frequencia') iconName = isFocused ? 'scan' : 'scan-outline';
          else if (route.name === 'Avisos') iconName = isFocused ? 'megaphone' : 'megaphone-outline';
          else if (route.name === 'Equipe') iconName = isFocused ? 'people' : 'people-outline';
          else if (route.name === 'Auditoria') iconName = isFocused ? 'shield-checkmark' : 'shield-checkmark-outline';
          else if (route.name === 'Alunos') iconName = isFocused ? 'school' : 'school-outline';
          else if (route.name === 'Familias') iconName = isFocused ? 'people' : 'people-outline';
          else if (route.name === 'Turmas') iconName = isFocused ? 'grid' : 'grid-outline';
          else if (route.name === 'Rotina') iconName = isFocused ? 'time' : 'time-outline';
          else if (route.name === 'Medicacao') iconName = isFocused ? 'medical' : 'medical-outline';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons name={iconName} size={28} color={isFocused ? '#0284C7' : '#94A3B8'} />
              <Text style={{ color: isFocused ? '#0284C7' : '#94A3B8', fontSize: 12, marginTop: 4, fontWeight: isFocused ? 'bold' : 'normal' }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

import { AuthContext } from '../contexts/AuthContext';
import { Image } from 'react-native';

export const StaffNavigator = ({ cargo }: StaffNavigatorProps) => {
  const { signOut } = React.useContext(AuthContext);

  const hasAccess = (screenName: string) => {
    if (!cargo) return false;
    const allowedRoles = RoleConfig[screenName];
    return allowedRoles ? allowedRoles.some(r => r.toLowerCase() === cargo.toLowerCase()) : false;
  };

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ 
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
        }
      }}
    >
      {hasAccess('Dashboard') && <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Painel Diretor' }} />}
      {hasAccess('Frequencia') && <Tab.Screen name="Frequencia" component={AttendanceScreen} options={{ title: 'Catraca' }} />}
      {hasAccess('Avisos') && <Tab.Screen name="Avisos" component={AdminNoticesScreen} options={{ title: 'Comunicação' }} />}
      {hasAccess('Equipe') && <Tab.Screen name="Equipe" component={StaffManagementScreen} options={{ title: 'Equipe' }} />}
      {hasAccess('Auditoria') && <Tab.Screen name="Auditoria" component={AuditLogsScreen} options={{ title: 'Auditoria' }} />}
      {hasAccess('Turmas') && <Tab.Screen name="Turmas" component={AdminTurmasScreen} options={{ title: 'Turmas' }} />}
      {hasAccess('Alunos') && <Tab.Screen name="Alunos" component={AdminAlunosScreen} options={{ title: 'Alunos' }} />}
      {hasAccess('Familias') && <Tab.Screen name="Familias" component={AdminFamiliasScreen} options={{ title: 'Famílias' }} />}
      {hasAccess('Rotina') && <Tab.Screen name="Rotina" component={AdminRotinaScreen} options={{ title: 'Rotina' }} />}

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: 75,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    minWidth: 70,
  }
});
