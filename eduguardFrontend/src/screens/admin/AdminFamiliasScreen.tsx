import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export const AdminFamiliasScreen = () => {
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ idresponsavel: 0, nome: '', cpf: '', celular: '' });

  const fetchFamilias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/familias');
      setFamilias(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFamilias();
    }, [])
  );

  const handleSave = async () => {
    if (!form.nome || !form.cpf || !form.celular) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/admin/familias/${form.idresponsavel}`, form);
        Toast.show({ type: 'success', text1: 'Responsável atualizado!' });
      } else {
        await api.post('/admin/familias', form);
        Toast.show({ type: 'success', text1: 'Responsável cadastrado!' });
      }
      setModalVisible(false);
      fetchFamilias();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao salvar responsável.' });
    }
  };

  const handleDelete = (id: number, nome: string) => {
    Alert.alert('Inativar Responsável', `Deseja inativar o responsável ${nome}? Ele não terá mais acesso ao app.`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Inativar', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/familias/${id}`);
            Toast.show({ type: 'success', text1: 'Responsável inativado!' });
            fetchFamilias();
          } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Erro ao inativar.' });
          }
        }
      }
    ]);
  };

  const openAddModal = () => {
    setForm({ idresponsavel: 0, nome: '', cpf: '', celular: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEditModal = (fam: any) => {
    setForm({ idresponsavel: fam.idresponsavel, nome: fam.nome, cpf: fam.cpf, celular: fam.celular });
    setIsEditing(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : familias.length > 0 ? (
          familias.map((fam: any, idx: number) => (
            <View key={idx} style={[styles.card, !fam.ativo && { opacity: 0.6 }]}>
              <View style={styles.avatar}>
                <Ionicons name="people" size={24} color={fam.ativo ? "#0284C7" : "#94A3B8"} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, !fam.ativo && { textDecorationLine: 'line-through' }]}>{fam.nome}</Text>
                <Text style={styles.details}>CPF: {fam.cpf}</Text>
                <Text style={styles.details}>Cel: {fam.celular || 'Não informado'}</Text>
                
                {fam.responsavelaluno && fam.responsavelaluno.length > 0 && (
                  <View style={{ marginTop: 6, backgroundColor: '#F1F5F9', padding: 6, borderRadius: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#64748B' }}>Alunos Vinculados:</Text>
                    {fam.responsavelaluno.map((ra: any, i: number) => (
                      <Text key={i} style={{ fontSize: 13, color: '#334155' }}>• {ra.aluno?.nome || 'Desconhecido'}</Text>
                    ))}
                  </View>
                )}

                <Text style={[styles.status, { color: fam.ativo ? '#10B981' : '#EF4444' }]}>
                  {fam.ativo ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
              <View style={styles.actions}>
                {fam.ativo && (
                  <>
                    <TouchableOpacity onPress={() => openEditModal(fam)}>
                      <Ionicons name="pencil" size={22} color="#F59E0B" style={{ padding: 8 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(fam.idresponsavel, fam.nome)}>
                      <Ionicons name="trash" size={22} color="#EF4444" style={{ padding: 8 }} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum responsável encontrado.</Text>
        )}
      </ScrollView>

      {/* FAB Adicionar Responsável */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="person-add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Modal Responsável */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Responsável' : 'Novo Responsável'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} placeholder="Ex: Maria da Silva" value={form.nome} onChangeText={(t) => setForm({...form, nome: t})} />
              
              <Text style={styles.label}>CPF (Apenas Números)</Text>
              <TextInput style={styles.input} placeholder="Ex: 12345678900" keyboardType="numeric" value={form.cpf} onChangeText={(t) => setForm({...form, cpf: t})} />
              
              <Text style={styles.label}>Celular (Apenas Números)</Text>
              <TextInput style={styles.input} placeholder="Ex: 11999998888" keyboardType="numeric" value={form.celular} onChangeText={(t) => setForm({...form, celular: t})} />
              
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Responsável'}</Text>
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
});
