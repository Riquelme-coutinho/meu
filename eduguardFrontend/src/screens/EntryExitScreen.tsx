import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';
import Toast from 'react-native-toast-message';

export const EntryExitScreen = () => {
  const [activeTab, setActiveTab] = useState<'historico' | 'autorizados'>('historico');
  
  // Historico State
  const [registros, setRegistros] = useState<any[]>([]);
  
  // Autorizados State
  const [autorizados, setAutorizados] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAutorizado, setNovoAutorizado] = useState({
    idaluno: '',
    nome: '',
    cpf: '',
    parentesco: '',
    telefone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRegistros = async () => {
    try {
      const response = await api.get('/entrada-saida/');
      setRegistros(response.data || []);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAutorizados = async () => {
    try {
      const response = await api.get('/autorizados/');
      setAutorizados(response.data || []);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos/meus');
      setAlunos(response.data || []);
      if (response.data && response.data.length > 0) {
        setNovoAutorizado(prev => ({ ...prev, idaluno: String(response.data[0].idaluno) }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'historico') {
      await fetchRegistros();
    } else {
      await fetchAutorizados();
      await fetchAlunos();
    }
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'historico') {
      await fetchRegistros();
    } else {
      await fetchAutorizados();
    }
    setRefreshing(false);
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAddAutorizado = async () => {
    if (!novoAutorizado.nome || !novoAutorizado.idaluno) {
      Alert.alert('Erro', 'Nome e aluno são obrigatórios.');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/autorizados/', {
        idaluno: Number(novoAutorizado.idaluno),
        nome: novoAutorizado.nome,
        cpf: novoAutorizado.cpf,
        parentesco: novoAutorizado.parentesco,
        telefone: novoAutorizado.telefone
      });
      Toast.show({ type: 'success', text1: 'Autorizado adicionado com sucesso!' });
      setModalVisible(false);
      setNovoAutorizado({ idaluno: novoAutorizado.idaluno, nome: '', cpf: '', parentesco: '', telefone: '' });
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAutorizado = (id: number) => {
    Alert.alert(
      'Remover Autorizado',
      'Tem certeza que deseja remover esta pessoa da lista de autorizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/autorizados/${id}`);
              Toast.show({ type: 'success', text1: 'Removido com sucesso!' });
              loadData();
            } catch (error) {
              handleError(error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'historico' && styles.activeTabButton]}
          onPress={() => setActiveTab('historico')}
        >
          <Text style={[styles.tabText, activeTab === 'historico' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'autorizados' && styles.activeTabButton]}
          onPress={() => setActiveTab('autorizados')}
        >
          <Text style={[styles.tabText, activeTab === 'autorizados' && styles.activeTabText]}>Autorizados</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#0284C7" 
            colors={['#0284C7']}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0284C7" />
          </View>
        ) : activeTab === 'historico' ? (
          registros.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum registro de portaria encontrado</Text>
            </View>
          ) : (
            registros.map((item, index) => {
              const descricao = item.descricao || '';
              const isEntrada = descricao.toLowerCase().includes('entrada');
              const typeColor = isEntrada ? '#16A34A' : '#EA580C';
              const typeBgColor = isEntrada ? '#DCFCE7' : '#FFEDD5';
              
              return (
                <View key={index} style={styles.card}>
                  <View style={styles.row}>
                    <View style={[styles.iconContainer, { backgroundColor: typeBgColor }]}>
                      <Text style={{ fontSize: 20 }}>{isEntrada ? '📥' : '📤'}</Text>
                    </View>
                    
                    <View style={styles.infoContainer}>
                      <Text style={styles.alunoName}>{item.aluno?.nome || 'Aluno Desconhecido'}</Text>
                      <Text style={styles.infoText}>Por: {item.responsavel?.nome || item.funcionario?.nome || 'Portaria'}</Text>
                      <Text style={styles.date}>
                        {item.datahorasys ? new Date(item.datahorasys).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Data Indisponível'}
                      </Text>
                    </View>
                    
                    <View style={styles.timeContainer}>
                      <View style={[styles.badge, { backgroundColor: typeBgColor }]}>
                        <Text style={[styles.tipoText, { color: typeColor }]}>{descricao}</Text>
                      </View>
                      <Text style={styles.timeText}>
                        {item.datahorasys ? new Date(item.datahorasys).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )
        ) : (
          autorizados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma pessoa autorizada encontrada.</Text>
            </View>
          ) : (
            autorizados.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.alunoName}>{item.nome}</Text>
                    <Text style={styles.infoText}>Parentesco: {item.parentesco || 'N/A'}</Text>
                    <Text style={styles.infoText}>CPF: {item.cpf || 'N/A'} • Tel: {item.telefone || 'N/A'}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.tipoText}>Aluno: {item.aluno?.nome}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveAutorizado(item.idautorizado)} style={styles.removeButton}>
                    <Text style={styles.removeText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        )}
      </ScrollView>

      {activeTab === 'autorizados' && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Autorizado</Text>

            <ScrollView>
              <Text style={styles.label}>Vincular ao Aluno:</Text>
              <View style={styles.alunoSelector}>
                {alunos.map((a) => (
                  <TouchableOpacity 
                    key={a.idaluno} 
                    style={[styles.alunoOption, novoAutorizado.idaluno === String(a.idaluno) && styles.alunoOptionSelected]}
                    onPress={() => setNovoAutorizado({...novoAutorizado, idaluno: String(a.idaluno)})}
                  >
                    <Text style={[styles.alunoOptionText, novoAutorizado.idaluno === String(a.idaluno) && styles.alunoOptionTextSelected]}>
                      {a.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput 
                style={styles.input} 
                value={novoAutorizado.nome}
                onChangeText={(t) => setNovoAutorizado({...novoAutorizado, nome: t})}
                placeholder="Ex: João Silva"
              />

              <Text style={styles.label}>Parentesco</Text>
              <TextInput 
                style={styles.input} 
                value={novoAutorizado.parentesco}
                onChangeText={(t) => setNovoAutorizado({...novoAutorizado, parentesco: t})}
                placeholder="Ex: Avô, Tio"
              />

              <Text style={styles.label}>CPF</Text>
              <TextInput 
                style={styles.input} 
                value={novoAutorizado.cpf}
                onChangeText={(t) => setNovoAutorizado({...novoAutorizado, cpf: t})}
                placeholder="000.000.000-00"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Telefone</Text>
              <TextInput 
                style={styles.input} 
                value={novoAutorizado.telefone}
                onChangeText={(t) => setNovoAutorizado({...novoAutorizado, telefone: t})}
                placeholder="(00) 00000-0000"
                keyboardType="numeric"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddAutorizado} disabled={submitting}>
                  {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabButton: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabButton: { borderBottomColor: '#0284C7' },
  tabText: { fontSize: 16, color: '#64748B', fontWeight: 'bold' },
  activeTabText: { color: '#0284C7' },
  scrollContent: { padding: 20, paddingBottom: 100, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { color: '#64748B', fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  alunoName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  date: { fontSize: 12, color: '#94A3B8' },
  timeContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginBottom: 8, backgroundColor: '#F1F5F9' },
  tipoText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
  removeButton: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  removeText: { color: '#DC2626', fontWeight: 'bold', fontSize: 12 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 32, color: '#FFFFFF', marginTop: -4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 16 },
  alunoSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  alunoOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  alunoOptionSelected: { backgroundColor: '#E0F2FE', borderColor: '#0284C7' },
  alunoOptionText: { color: '#64748B', fontWeight: 'bold' },
  alunoOptionTextSelected: { color: '#0284C7' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingBottom: 24 },
  cancelButton: { flex: 1, padding: 16, alignItems: 'center', marginRight: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  cancelButtonText: { color: '#64748B', fontWeight: 'bold', fontSize: 16 },
  saveButton: { flex: 1, padding: 16, alignItems: 'center', marginLeft: 8, borderRadius: 12, backgroundColor: '#0284C7' },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});