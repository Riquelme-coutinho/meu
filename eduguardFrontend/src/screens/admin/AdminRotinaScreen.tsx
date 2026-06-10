import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { decodeJwt } from '../../utils/jwtParser';

export const AdminRotinaScreen = () => {
  const [rotinas, setRotinas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { userToken } = useContext(AuthContext);
  const [cargo, setCargo] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [idchecklist, setIdchecklist] = useState<number>(0);
  const [alunosStatus, setAlunosStatus] = useState<Record<number, { rotinafeita: boolean, obsden_o: string }>>({});

  useEffect(() => {
    if (userToken) {
      const decoded = decodeJwt(userToken);
      if (decoded?.cargo) setCargo(decoded.cargo.toLowerCase());
      if (decoded?.id) setUserId(decoded.id);
    }
  }, [userToken]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rotinasRes, alunosRes, checklistsRes, turmasRes] = await Promise.all([
        api.get('/admin/rotinas'),
        api.get('/admin/alunos'),
        api.get('/admin/checklists'),
        api.get('/admin/turmas')
      ]);
      setRotinas(rotinasRes.data);
      setAlunos(alunosRes.data.filter((a: any) => a.ativo));
      setChecklists(checklistsRes.data);
      
      const turmasData = turmasRes.data;
      setTurmas(turmasData);

      // If professor, lock the selected class to their class
      if (cargo === 'professor' && userId) {
        const minhaTurma = turmasData.find((t: any) => t.idfuncionario === userId);
        if (minhaTurma) {
          setSelectedTurmaId(minhaTurma.idturma);
        }
      } else if (turmasData.length > 0 && !selectedTurmaId) {
        setSelectedTurmaId(turmasData[0].idturma);
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao carregar dados.' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [cargo, userId])
  );

  const alunosFiltrados = alunos.filter(a => a.idturma === selectedTurmaId);

  const handleSaveBulk = async () => {
    if (!idchecklist) {
      Toast.show({ type: 'error', text1: 'Selecione a atividade (Checklist).' });
      return;
    }

    const payloadRotinas = alunosFiltrados.map(a => {
      const status = alunosStatus[a.idaluno] || { rotinafeita: true, obsden_o: '' };
      return {
        idaluno: a.idaluno,
        rotinafeita: status.rotinafeita,
        obsden_o: status.obsden_o
      };
    });

    if (payloadRotinas.length === 0) {
      Toast.show({ type: 'error', text1: 'Não há alunos nesta turma para lançar rotina.' });
      return;
    }

    try {
      await api.post('/admin/rotinas/bulk', {
        idchecklist,
        rotinas: payloadRotinas
      });
      Toast.show({ type: 'success', text1: 'Rotina da turma lançada com sucesso!' });
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao lançar rotinas.' });
    }
  };

  const openBulkModal = () => {
    setIdchecklist(checklists.length > 0 ? checklists[0].idchecklist : 0);
    const initialStatus: Record<number, { rotinafeita: boolean, obsden_o: string }> = {};
    alunosFiltrados.forEach(a => {
      initialStatus[a.idaluno] = { rotinafeita: true, obsden_o: '' };
    });
    setAlunosStatus(initialStatus);
    setModalVisible(true);
  };

  const toggleAlunoStatus = (idaluno: number, val: boolean) => {
    setAlunosStatus(prev => ({
      ...prev,
      [idaluno]: { ...prev[idaluno], rotinafeita: val }
    }));
  };

  const setAlunoObs = (idaluno: number, text: string) => {
    setAlunosStatus(prev => ({
      ...prev,
      [idaluno]: { ...prev[idaluno], obsden_o: text }
    }));
  };

  // Filter available turmas to show in the tabs
  const availableTurmas = cargo === 'professor' 
    ? turmas.filter(t => t.idfuncionario === userId) 
    : turmas;

  return (
    <View style={styles.container}>
      {/* Filtro de Turmas */}
      <View style={styles.turmasWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.turmasScroll}>
          {availableTurmas.map((turma: any) => (
            <TouchableOpacity 
              key={turma.idturma}
              style={[styles.turmaTab, selectedTurmaId === turma.idturma && styles.turmaTabActive]}
              onPress={() => setSelectedTurmaId(turma.idturma)}
            >
              <Text style={[styles.turmaTabText, selectedTurmaId === turma.idturma && styles.turmaTabTextActive]}>
                {turma.codigoturma || `Turma ${turma.idturma}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : rotinas.length > 0 ? (
          rotinas.map((rotina: any, idx: number) => (
            <View key={idx} style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="time" size={24} color="#0284C7" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{rotina.aluno?.nome || 'Aluno'}</Text>
                <Text style={styles.details}>{rotina.checklist?.descricao || 'Atividade'}</Text>
                {rotina.obsden_o ? (
                  <Text style={styles.obs}>Obs: {rotina.obsden_o}</Text>
                ) : null}
                <Text style={styles.date}>
                  {new Date(rotina.datahorasys).toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.status, { color: rotina.rotinafeita ? '#10B981' : '#F59E0B' }]}>
                  {rotina.rotinafeita ? 'Feito' : 'Não Feito'}
                </Text>
                <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>
                  {rotina.funcionario?.nome?.split(' ')[0] || 'Staff'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma rotina encontrada.</Text>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openBulkModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Modal Lançamento em Massa */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rotina da Turma</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.label}>1. Selecione a Atividade *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {checklists.map((c: any) => (
                  <TouchableOpacity 
                    key={c.idchecklist} 
                    style={[styles.chip, idchecklist === c.idchecklist && styles.chipSelected]}
                    onPress={() => setIdchecklist(c.idchecklist)}
                  >
                    <Text style={[styles.chipText, idchecklist === c.idchecklist && styles.chipTextSelected]}>
                      {c.descricao}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.label}>2. Situação dos Alunos</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '60%' }}>
              {alunosFiltrados.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum aluno nesta turma.</Text>
              ) : (
                alunosFiltrados.map((aluno: any) => {
                  const status = alunosStatus[aluno.idaluno] || { rotinafeita: true, obsden_o: '' };
                  return (
                    <View key={aluno.idaluno} style={styles.alunoRow}>
                      <View style={styles.alunoRowTop}>
                        <Text style={styles.alunoName}>{aluno.nome.length > 20 ? aluno.nome.substring(0,20)+'...' : aluno.nome}</Text>
                        <View style={styles.switchContainer}>
                          <Text style={[styles.statusText, { color: status.rotinafeita ? '#10B981' : '#F59E0B' }]}>
                            {status.rotinafeita ? 'Feito' : 'Não'}
                          </Text>
                          <Switch 
                            value={status.rotinafeita}
                            onValueChange={(val) => toggleAlunoStatus(aluno.idaluno, val)}
                            trackColor={{ false: '#FDE68A', true: '#6EE7B7' }}
                            thumbColor={status.rotinafeita ? '#10B981' : '#F59E0B'}
                          />
                        </View>
                      </View>
                      {!status.rotinafeita && (
                        <TextInput 
                          style={styles.obsInput} 
                          placeholder="Justificativa (ex: Sem sono, comeu pouco)" 
                          value={status.obsden_o} 
                          onChangeText={(t) => setAlunoObs(aluno.idaluno, t)} 
                        />
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleSaveBulk}>
              <Text style={styles.buttonText}>Salvar Turma Toda</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  turmasWrapper: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 12 },
  turmasScroll: { paddingHorizontal: 16 },
  turmaTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 12 },
  turmaTabActive: { backgroundColor: '#0284C7' },
  turmaTabText: { color: '#64748B', fontWeight: 'bold' },
  turmaTabTextActive: { color: '#FFF' },
  content: { padding: 20, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  details: { fontSize: 14, color: '#0284C7', marginBottom: 2, fontWeight: '500' },
  obs: { fontSize: 13, color: '#64748B', fontStyle: 'italic', marginBottom: 4 },
  date: { fontSize: 12, color: '#94A3B8' },
  status: { fontSize: 12, fontWeight: 'bold' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  fab: { position: 'absolute', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#0284C7', borderRadius: 32, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: 'bold' },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16, marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { color: '#64748B', fontWeight: 'bold' },
  chipTextSelected: { color: '#FFF' },
  
  alunoRow: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  alunoRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alunoName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', flex: 1 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  statusText: { fontSize: 13, fontWeight: 'bold', marginRight: 8 },
  obsInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6, padding: 10, marginTop: 10, fontSize: 14 }
});
