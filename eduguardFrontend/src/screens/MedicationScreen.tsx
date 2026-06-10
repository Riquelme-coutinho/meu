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
import * as ImagePicker from 'expo-image-picker';

export const MedicationScreen = () => {
  const [medicacoes, setMedicacoes] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [novaMedicacao, setNovaMedicacao] = useState({
    idaluno: '',
    nome: '',
    dosagem: '',
    descfrequencia: ''
  });
  const [receitaFile, setReceitaFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicacoes = async () => {
    try {
      const response = await api.get('/medicacoes/meus');
      setMedicacoes(response.data || []);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos/meus');
      setAlunos(response.data || []);
      if (response.data && response.data.length > 0) {
        setNovaMedicacao(prev => ({ ...prev, idaluno: String(response.data[0].idaluno) }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMedicacoes(), fetchAlunos()]);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMedicacoes();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para anexar a receita.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setReceitaFile(result.assets[0]);
    }
  };

  const handleAddMedicacao = async () => {
    if (!novaMedicacao.nome || !novaMedicacao.idaluno) {
      Alert.alert('Erro', 'O nome do remédio e o aluno são obrigatórios.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('idaluno', novaMedicacao.idaluno);
      formData.append('nome', novaMedicacao.nome);
      if (novaMedicacao.dosagem) formData.append('dosagem', novaMedicacao.dosagem);
      if (novaMedicacao.descfrequencia) formData.append('descfrequencia', novaMedicacao.descfrequencia);
      
      if (receitaFile) {
        formData.append('receita', {
          uri: receitaFile.uri,
          type: receitaFile.mimeType || 'image/jpeg',
          name: receitaFile.fileName || `receita_${Date.now()}.jpg`,
        } as any);
      }

      await api.post('/medicacoes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({ type: 'success', text1: 'Medicação cadastrada!' });
      setModalVisible(false);
      setNovaMedicacao({ idaluno: novaMedicacao.idaluno, nome: '', dosagem: '', descfrequencia: '' });
      setReceitaFile(null);
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedicacao = (id: number) => {
    Alert.alert(
      "Remover Medicação",
      "Tem certeza que deseja remover esta medicação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/medicacoes/${id}`);
              Toast.show({ type: 'success', text1: 'Medicação removida!' });
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
        ) : medicacoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma medicação ativa no momento</Text>
          </View>
        ) : (
          medicacoes.map((item) => {
            const hasAdministration = item.administracaomedicacao && item.administracaomedicacao.length > 0;
            const lastAdmin = hasAdministration ? item.administracaomedicacao[0] : null;

            return (
              <View key={item.idmedicacao} style={styles.card}>
                <View style={styles.headerRow}>
                  <Text style={styles.medicineName}>💊 {item.nome}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => handleDeleteMedicacao(item.idmedicacao)} style={{ marginRight: 8 }}>
                      <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Excluir</Text>
                    </TouchableOpacity>
                    <View style={[
                      styles.statusBadge, 
                      hasAdministration ? styles.statusAdministrado : styles.statusPendente
                    ]}>
                      <Text style={[
                        styles.statusText,
                        hasAdministration ? styles.statusTextAdministrado : styles.statusTextPendente
                      ]}>
                        {hasAdministration ? 'Administrado' : 'Pendente'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Aluno:</Text>
                  <Text style={styles.infoValue}>{item.aluno?.nome || 'Não informado'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dose:</Text>
                  <Text style={styles.infoValue}>{item.dosagem || 'Não informada'}</Text>
                </View>

                {item.descfrequencia && (
                  <View style={styles.obsContainer}>
                    <Text style={styles.obs}>Frequência: {item.descfrequencia}</Text>
                  </View>
                )}
                
                {item.url_receita && (
                  <View style={styles.receitaBadge}>
                    <Text style={styles.receitaText}>📎 Receita Anexada</Text>
                  </View>
                )}

                <View style={styles.footer}>
                  <Text style={styles.timeText}>
                    {hasAdministration && lastAdmin?.datahorasysdate
                      ? `Aplicado em: ${new Date(lastAdmin.datahorasysdate).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                      : `Aguardando aplicação`
                    }
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Medicação</Text>

            <ScrollView>
              <Text style={styles.label}>Vincular ao Aluno:</Text>
              <View style={styles.alunoSelector}>
                {alunos.map((a) => (
                  <TouchableOpacity 
                    key={a.idaluno} 
                    style={[styles.alunoOption, novaMedicacao.idaluno === String(a.idaluno) && styles.alunoOptionSelected]}
                    onPress={() => setNovaMedicacao({...novaMedicacao, idaluno: String(a.idaluno)})}
                  >
                    <Text style={[styles.alunoOptionText, novaMedicacao.idaluno === String(a.idaluno) && styles.alunoOptionTextSelected]}>
                      {a.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Nome do Remédio *</Text>
              <TextInput 
                style={styles.input} 
                value={novaMedicacao.nome}
                onChangeText={(t) => setNovaMedicacao({...novaMedicacao, nome: t})}
                placeholder="Ex: Amoxicilina 500mg"
              />

              <Text style={styles.label}>Dosagem</Text>
              <TextInput 
                style={styles.input} 
                value={novaMedicacao.dosagem}
                onChangeText={(t) => setNovaMedicacao({...novaMedicacao, dosagem: t})}
                placeholder="Ex: 5ml"
              />

              <Text style={styles.label}>Frequência/Horários</Text>
              <TextInput 
                style={styles.input} 
                value={novaMedicacao.descfrequencia}
                onChangeText={(t) => setNovaMedicacao({...novaMedicacao, descfrequencia: t})}
                placeholder="Ex: De 8h em 8h"
              />

              <Text style={styles.label}>Receita Médica</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <Text style={styles.uploadButtonText}>
                  {receitaFile ? '✅ ' + (receitaFile.fileName || 'Imagem selecionada') : '📎 Anexar Foto da Receita'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setReceitaFile(null); }}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddMedicacao} disabled={submitting}>
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
  scrollContent: { padding: 20, paddingBottom: 100, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { color: '#64748B', fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  medicineName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', flex: 1 },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginLeft: 8 },
  statusAdministrado: { backgroundColor: '#DCFCE7' },
  statusPendente: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextAdministrado: { color: '#16A34A' },
  statusTextPendente: { color: '#D97706' },
  infoRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  infoLabel: { width: 60, fontSize: 14, color: '#64748B', fontWeight: '500' },
  infoValue: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '600' },
  obsContainer: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#94A3B8' },
  obs: { fontSize: 14, color: '#475569', fontStyle: 'italic' },
  receitaBadge: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  receitaText: { color: '#0284C7', fontSize: 12, fontWeight: 'bold' },
  footer: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  timeText: { fontSize: 13, color: '#94A3B8', textAlign: 'right' },
  
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 32, color: '#FFFFFF', marginTop: -4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 16 },
  alunoSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  alunoOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  alunoOptionSelected: { backgroundColor: '#E0F2FE', borderColor: '#0284C7' },
  alunoOptionText: { color: '#64748B', fontWeight: 'bold' },
  alunoOptionTextSelected: { color: '#0284C7' },
  uploadButton: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  uploadButtonText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingBottom: 24 },
  cancelButton: { flex: 1, padding: 16, alignItems: 'center', marginRight: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  cancelButtonText: { color: '#64748B', fontWeight: 'bold', fontSize: 16 },
  saveButton: { flex: 1, padding: 16, alignItems: 'center', marginLeft: 8, borderRadius: 12, backgroundColor: '#0284C7' },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});