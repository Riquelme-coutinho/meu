import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export const AuditLogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logs');
        setLogs(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : logs.length > 0 ? (
          logs.map((log: any, idx: number) => (
            <View key={idx} style={styles.logCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={20} color="#059669" />
              </View>
              <View style={styles.logInfo}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logUser}>Usuário: {log.user}</Text>
                <Text style={styles.logTime}>{new Date(log.timestamp).toLocaleString()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum log de segurança encontrado.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  content: { padding: 20 },
  logCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logInfo: { flex: 1 },
  logAction: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  logUser: { fontSize: 14, color: '#475569', marginBottom: 2 },
  logTime: { fontSize: 12, color: '#94A3B8' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 }
});
