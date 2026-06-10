import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export const AdminAlunosScreen = () => {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [familias, setFamilias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  // Modal Aluno State
  const [alunoModalVisible, setAlunoModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alunoForm, setAlunoForm] = useState({ idaluno: 0, nome: '', matricula: '', idturma: 0, idresponsaveis: [] as number[] });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alunosRes, turmasRes, familiasRes] = await Promise.all([
        api.get('/admin/alunos'),
        api.get('/admin/turmas'),
        api.get('/admin/familias')
      ]);
      setAlunos(alunosRes.data);
      setTurmas(turmasRes.data);
      setFamilias(familiasRes.data);
      
      // Select first class by default if none selected
      if (selectedTurmaId === null && turmasRes.data.length > 0) {
        setSelectedTurmaId(turmasRes.data[0].idturma);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const filteredAlunos = selectedTurmaId === null 
    ? alunos 
    : alunos.filter((a: any) => a.idturma === selectedTurmaId);

  // ALUNO CRUD
  const handleSaveAluno = async () => {
    if (!alunoForm.nome || !alunoForm.idturma || (!isEditing && alunoForm.idresponsaveis.length === 0)) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/admin/alunos/${alunoForm.idaluno}`, alunoForm);
        Toast.show({ type: 'success', text1: 'Aluno atualizado!' });
      } else {
        await api.post('/admin/alunos', alunoForm);
        Toast.show({ type: 'success', text1: 'Aluno cadastrado!' });
      }
      setAlunoModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao salvar aluno.' });
    }
  };

  const handleDeleteAluno = (idaluno: number, nome: string) => {
    Alert.alert('Excluir Aluno', `Deseja excluir permanentemente o aluno ${nome} e todos os seus históricos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/alunos/${idaluno}`);
            Toast.show({ type: 'success', text1: 'Aluno excluído permanentemente!' });
            fetchData();
          } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Erro ao excluir.' });
          }
        }
      }
    ]);
  };

  const openAddModal = () => {
    setAlunoForm({ idaluno: 0, nome: '', matricula: '', idturma: selectedTurmaId || (turmas.length > 0 ? turmas[0].idturma : 0), idresponsaveis: familias.length > 0 ? [familias[0].idresponsavel] : [] });
    setIsEditing(false);
    setAlunoModalVisible(true);
  };

  const openEditModal = (aluno: any) => {
    const ids = aluno.responsavelaluno ? aluno.responsavelaluno.map((ra: any) => ra.idresponsavel) : [];
    setAlunoForm({ idaluno: aluno.idaluno, nome: aluno.nome, matricula: aluno.matricula, idturma: aluno.idturma, idresponsaveis: ids });
    setIsEditing(true);
    setAlunoModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Turmas Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <TouchableOpacity 
            style={[styles.chip, selectedTurmaId === null && styles.chipSelected]}
            onPress={() => setSelectedTurmaId(null)}
          >
            <Text style={[styles.chipText, selectedTurmaId === null && styles.chipTextSelected]}>Todas as Turmas</Text>
          </TouchableOpacity>
          {turmas.map((t: any) => (
            <TouchableOpacity 
              key={t.idturma} 
              style={[styles.chip, selectedTurmaId === t.idturma && styles.chipSelected]}
              onPress={() => setSelectedTurmaId(t.idturma)}
            >
              <Text style={[styles.chipText, selectedTurmaId === t.idturma && styles.chipTextSelected]}>
                {t.codigoturma}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Alunos List */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : filteredAlunos.length > 0 ? (
          filteredAlunos.map((aluno: any, idx: number) => (
            <View key={idx} style={[styles.card, !aluno.ativo && { opacity: 0.6 }]}>
              <View style={styles.avatar}>
                <Ionicons name="school" size={24} color={aluno.ativo ? "#0284C7" : "#94A3B8"} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, !aluno.ativo && { textDecorationLine: 'line-through' }]}>{aluno.nome || 'Sem Nome'}</Text>
                <Text style={styles.details}>Matrícula: {aluno.matricula || 'N/A'}</Text>
                <Text style={styles.details}>Turma: {aluno.turma || 'N/A'}</Text>
                <Text style={[styles.status, { color: aluno.ativo ? '#10B981' : '#EF4444' }]}>
                  {aluno.ativo ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEditModal(aluno)}>
                  <Ionicons name="pencil" size={22} color="#F59E0B" style={{ padding: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAluno(aluno.idaluno, aluno.nome)}>
                  <Ionicons name="trash" size={22} color="#EF4444" style={{ padding: 8 }} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum aluno encontrado nesta turma.</Text>
        )}
      </ScrollView>

      {/* FAB Adicionar Aluno */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="person-add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Modal Aluno */}
      <Modal visible={alunoModalVisible} animationType="slide" transparent={true} onRequestClose={() => setAlunoModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Aluno' : 'Novo Aluno'}</Text>
              <TouchableOpacity onPress={() => setAlunoModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} placeholder="Ex: João da Silva" value={alunoForm.nome} onChangeText={(t) => setAlunoForm({...alunoForm, nome: t})} />
              
              {isEditing && (
                <>
                  <Text style={styles.label}>Matrícula</Text>
                  <TextInput style={styles.input} placeholder="Ex: 2024001" value={alunoForm.matricula} onChangeText={(t) => setAlunoForm({...alunoForm, matricula: t})} />
                </>
              )}

              <Text style={styles.label}>Família (Responsável)</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {familias.map((f: any) => {
                  const isSelected = alunoForm.idresponsaveis.includes(f.idresponsavel);
                  return (
                    <TouchableOpacity 
                      key={f.idresponsavel} 
                      style={[styles.modalChip, isSelected && styles.modalChipSelected]}
                      onPress={() => {
                        if (isSelected) {
                          setAlunoForm({...alunoForm, idresponsaveis: alunoForm.idresponsaveis.filter(id => id !== f.idresponsavel)});
                        } else {
                          setAlunoForm({...alunoForm, idresponsaveis: [...alunoForm.idresponsaveis, f.idresponsavel]});
                        }
                      }}
                    >
                      <Text style={[styles.modalChipText, isSelected && styles.modalChipTextSelected]}>
                        {f.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Turma</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {turmas.map((t: any) => (
                  <TouchableOpacity 
                    key={t.idturma} 
                    style={[styles.modalChip, alunoForm.idturma === t.idturma && styles.modalChipSelected]}
                    onPress={() => setAlunoForm({...alunoForm, idturma: t.idturma})}
                  >
                    <Text style={[styles.modalChipText, alunoForm.idturma === t.idturma && styles.modalChipTextSelected]}>
                      {t.codigoturma}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleSaveAluno}>
                <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  filterContainer: { backgroundColor: '#FFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', elevation: 2 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { color: '#64748B', fontWeight: 'bold' },
  chipTextSelected: { color: '#FFF' },
  content: { padding: 20, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  details: { fontSize: 14, color: '#64748B', marginBottom: 2 },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  fab: { position: 'absolute', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#0284C7', borderRadius: 32, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  modalChipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  modalChipText: { color: '#64748B', fontWeight: 'bold' },
  modalChipTextSelected: { color: '#FFF' },
});
