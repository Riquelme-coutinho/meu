import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : (
          <>
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Alunos Ativos</Text>
                <Text style={styles.metricValue}>{data?.activeAlunos || 0}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Movimentações Hoje</Text>
                <Text style={styles.metricValue}>{data?.todayLogs || 0}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Entradas e Saídas Recentes</Text>
            {data?.recentLogs?.length > 0 ? (
              data.recentLogs.map((log: any, idx: number) => (
                <View key={idx} style={styles.logCard}>
                  <Text style={styles.logStudent}>{log.aluno?.nome || 'Aluno Desconhecido'}</Text>
                  <Text style={styles.logTime}>
                    {new Date(log.datahora).toLocaleTimeString()} - {log.tipo}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma movimentação registrada hoje.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#0284C7', elevation: 2, alignItems: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 36, height: 36, marginRight: 10, tintColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  logoutButton: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { color: '#FFF', marginLeft: 4, fontWeight: 'bold' },
  content: { padding: 20 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  metricCard: { flex: 1, backgroundColor: '#0284C7', padding: 20, borderRadius: 12, marginHorizontal: 5, alignItems: 'center' },
  metricLabel: { color: '#E0F2FE', fontSize: 14, marginBottom: 8 },
  metricValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#334155' },
  logCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  logStudent: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  logTime: { fontSize: 14, color: '#64748B', marginTop: 4 },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 }
});
