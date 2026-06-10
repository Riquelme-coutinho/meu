import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export const AdminTurmasScreen = () => {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ idturma: 0, codigoturma: '', capacidademaxima: '30', idfuncionario: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTurmas, resStaff] = await Promise.all([
        api.get('/admin/turmas'),
        api.get('/admin/staff')
      ]);
      setTurmas(resTurmas.data);
      
      // Filter staff for 'Professor' or 'Professor(a)' depending on what is returned
      const profs = resStaff.data.filter((s: any) => s.cargo?.toLowerCase().includes('professor'));
      setProfessores(profs);

    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao carregar turmas.' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSave = async () => {
    if (!form.codigoturma) {
      Toast.show({ type: 'error', text1: 'O Código da turma é obrigatório.' });
      return;
    }
    
    const payload: any = { 
      codigoturma: form.codigoturma, 
      capacidademaxima: form.capacidademaxima 
    };
    if (form.idfuncionario) {
      payload.idfuncionario = Number(form.idfuncionario);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/turmas/${form.idturma}`, payload);
        Toast.show({ type: 'success', text1: 'Turma atualizada!' });
      } else {
        await api.post('/admin/turmas', payload);
        Toast.show({ type: 'success', text1: 'Turma cadastrada!' });
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao salvar turma.' });
    }
  };

  const handleDelete = (idturma: number, codigoturma: string) => {
    Alert.alert('Excluir Turma', `Deseja excluir a turma ${codigoturma}? Só será possível se não houver alunos.`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/turmas/${idturma}`);
            Toast.show({ type: 'success', text1: 'Turma excluída!' });
            fetchData();
          } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Não é possível excluir. Remova os alunos da turma primeiro.' });
          }
        }
      }
    ]);
  };

  const openAddModal = () => {
    setForm({ idturma: 0, codigoturma: '', capacidademaxima: '30', idfuncionario: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEditModal = (turma: any) => {
    setForm({ 
      idturma: turma.idturma, 
      codigoturma: turma.codigoturma, 
      capacidademaxima: String(turma.capacidademaxima || 30),
      idfuncionario: turma.idfuncionario ? String(turma.idfuncionario) : ''
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : turmas.length > 0 ? (
          turmas.map((turma: any, idx: number) => (
            <View key={idx} style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="grid" size={24} color="#0284C7" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{turma.codigoturma || `Turma ID ${turma.idturma}`}</Text>
                <Text style={styles.details}>
                  Capacidade: {turma.capacidademaxima ? `${turma.capacidademaxima} Alunos` : 'N/A'}
                </Text>
                {turma.funcionario?.nome && (
                  <Text style={styles.teacherText}>Professor(a): {turma.funcionario.nome}</Text>
                )}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEditModal(turma)}>
                  <Ionicons name="pencil" size={22} color="#F59E0B" style={{ padding: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(turma.idturma, turma.codigoturma)}>
                  <Ionicons name="trash" size={22} color="#EF4444" style={{ padding: 8 }} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma turma encontrada.</Text>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Modal CRUD */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Turma' : 'Nova Turma'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Código da Turma *</Text>
              <TextInput style={styles.input} placeholder="Ex: T1A" value={form.codigoturma} onChangeText={(t) => setForm({...form, codigoturma: t})} />
              
              <Text style={styles.label}>Capacidade Máxima</Text>
              <TextInput style={styles.input} placeholder="Ex: 30" keyboardType="numeric" value={form.capacidademaxima} onChangeText={(t) => setForm({...form, capacidademaxima: t})} />
              
              <Text style={styles.label}>Professor(a) Responsável:</Text>
              <View style={styles.chipsContainer}>
                <TouchableOpacity 
                  style={[styles.chip, !form.idfuncionario && styles.chipSelected]}
                  onPress={() => setForm({...form, idfuncionario: ''})}
                >
                  <Text style={[styles.chipText, !form.idfuncionario && styles.chipTextSelected]}>Nenhum</Text>
                </TouchableOpacity>

                {professores.map((p: any) => (
                  <TouchableOpacity 
                    key={p.idfuncionario} 
                    style={[styles.chip, form.idfuncionario === String(p.idfuncionario) && styles.chipSelected]}
                    onPress={() => setForm({...form, idfuncionario: String(p.idfuncionario)})}
                  >
                    <Text style={[styles.chipText, form.idfuncionario === String(p.idfuncionario) && styles.chipTextSelected]}>
                      {p.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Turma'}</Text>
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
  content: { padding: 20, paddingBottom: 80 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  details: { fontSize: 12, color: '#64748B' },
  teacherText: { fontSize: 12, color: '#0284C7', fontWeight: 'bold', marginTop: 2 },
  actions: { flexDirection: 'row' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  fab: { position: 'absolute', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#0284C7', borderRadius: 32, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  input: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { color: '#64748B', fontWeight: 'bold' },
  chipTextSelected: { color: '#FFF' },

  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
