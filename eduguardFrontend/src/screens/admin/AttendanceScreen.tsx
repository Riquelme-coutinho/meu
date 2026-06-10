import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';

export const AttendanceScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [document, setDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const fetchRecentLogs = async () => {
    try {
      const response = await api.get('/admin/attendance/recent');
      setRecentLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch recent logs', error);
    }
  };

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  const handleAttendance = async (tipo: 'ENTRADA' | 'SAIDA') => {
    if (!document) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Digite o CPF ou Matrícula' });
      return;
    }

    try {
      setLoading(true);
      await api.post('/admin/attendance', { document, tipo });
      Toast.show({ type: 'success', text1: 'Sucesso', text2: `Registro de ${tipo} confirmado!` });
      setDocument('');
      fetchRecentLogs();
    } catch (error: any) {
      console.error(error);
      Toast.show({ 
        type: 'error', 
        text1: 'Falha no Registro', 
        text2: error.response?.data?.message || 'Não foi possível registrar a frequência.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="qr-code-outline" size={40} color="#0284C7" />
            </View>
            <Text style={styles.instruction}>Escaneie ou digite a Matrícula do Aluno ou CPF do Responsável Autorizado</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Ex: 123456 ou 000.000.000-00"
              value={document}
              onChangeText={setDocument}
              keyboardType="default"
              autoCapitalize="none"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.btnEntrada]} 
                onPress={() => handleAttendance('ENTRADA')}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Registrar Entrada</Text>}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.btnSaida]} 
                onPress={() => handleAttendance('SAIDA')}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Registrar Saída</Text>}
              </TouchableOpacity>
            </View>
          </View>

          {recentLogs.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentHeader}>Registros Recentes</Text>
              {recentLogs.map((log: any, index: number) => (
                <View key={index} style={styles.logCard}>
                  <Ionicons 
                    name={log.tipo === 'ENTRADA' ? 'arrow-down-circle' : 'arrow-up-circle'} 
                    size={24} 
                    color={log.tipo === 'ENTRADA' ? '#10B981' : '#EF4444'} 
                  />
                  <View style={styles.logInfo}>
                    <Text style={styles.logAluno}>{log.aluno?.nome || 'Desconhecido'}</Text>
                    <Text style={styles.logDetails}>
                      {log.tipo} • {new Date(log.datahora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', elevation: 2, flexDirection: 'row', alignItems: 'center' },
  headerTitleContainer: { flex: 2, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  logoutButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  logoutText: { color: '#EF4444', marginLeft: 4, fontWeight: 'bold' },
  content: { padding: 20 },
  card: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5, marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  instruction: { fontSize: 16, color: '#334155', textAlign: 'center', marginBottom: 24 },
  input: { width: '100%', height: 56, backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 16, fontSize: 18, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnEntrada: { backgroundColor: '#10B981', marginRight: 8 },
  btnSaida: { backgroundColor: '#EF4444', marginLeft: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  recentSection: { marginTop: 10 },
  recentHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  logCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  logInfo: { marginLeft: 12, flex: 1 },
  logAluno: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  logDetails: { fontSize: 14, color: '#64748B', marginTop: 2 }
});
