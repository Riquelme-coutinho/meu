import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export const StaffManagementScreen = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [funcoes, setFuncoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idfuncao, setIdfuncao] = useState('2'); // Default to Porteiro

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/staff');
      const funcResponse = await api.get('/admin/funcoes');
      setFuncoes(funcResponse.data);
      if (funcResponse.data.length > 0 && !editingId && !modalVisible) {
        setIdfuncao(String(funcResponse.data[0].idfuncao));
      }
      setStaff(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNome('');
    setCpf('');
    setEmail('');
    setSenha('');
    if (funcoes.length > 0) setIdfuncao(String((funcoes[0] as any).idfuncao));
    setModalVisible(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.idfuncionario);
    setNome(member.nome || '');
    setCpf(member.cpf || '');
    setEmail(member.email || '');
    setSenha(''); // Keep blank to not update password
    
    // Find idfuncao from string cargo or member object
    const funcMatch = funcoes.find((f: any) => f.descricaofuncao.toLowerCase() === member.cargo.toLowerCase());
    if (funcMatch) setIdfuncao(String((funcMatch as any).idfuncao));
    
    setModalVisible(true);
  };

  const handleSaveStaff = async () => {
    if (!nome || !cpf || (!editingId && !senha)) {
      Toast.show({ type: 'error', text1: 'Preencha os campos obrigatórios' });
      return;
    }
    
    const payload: any = { nome, cpf, email, idfuncao: Number(idfuncao) };
    if (senha) payload.senha = senha;

    try {
      if (editingId) {
        await api.put(`/admin/staff/${editingId}`, payload);
        Toast.show({ type: 'success', text1: 'Funcionário atualizado!' });
      } else {
        await api.post('/admin/staff', payload);
        Toast.show({ type: 'success', text1: 'Funcionário cadastrado!' });
      }
      setModalVisible(false);
      fetchStaff();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: editingId ? 'Erro ao atualizar.' : 'Erro ao cadastrar.' });
    }
  };

  const handleDeleteStaff = (id: number, nomeStaff: string) => {
    Alert.alert('Excluir', `Deseja realmente excluir ${nomeStaff}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/staff/${id}`);
            Toast.show({ type: 'success', text1: 'Funcionário removido!' });
            fetchStaff();
          } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Erro ao excluir.' });
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0284C7" />
        ) : staff.length > 0 ? (
          staff.map((member: any, idx: number) => (
            <View key={idx} style={styles.staffCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{member.nome || 'Sem Nome'}</Text>
                <Text style={styles.role}>{member.cargo}</Text>
                <Text style={styles.statusText}>CPF: {member.cpf}</Text>
                <Text style={styles.statusText}>E-mail: {member.email}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openEditModal(member)}>
                  <Ionicons name="pencil" size={24} color="#0284C7" style={{ padding: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteStaff(member.idfuncionario, member.nome)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" style={{ padding: 8 }} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum funcionário encontrado.</Text>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Modal de Cadastro/Edição */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
              <TextInput style={styles.input} placeholder="CPF (Apenas números)" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder={editingId ? "Nova Senha (opcional)" : "Senha Provisória"} value={senha} onChangeText={setSenha} secureTextEntry />
              
              <Text style={styles.label}>Função:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {funcoes.map((f: any) => (
                  <TouchableOpacity 
                    key={f.idfuncao} 
                    style={[styles.chip, idfuncao === String(f.idfuncao) && styles.chipSelected]}
                    onPress={() => setIdfuncao(String(f.idfuncao))}
                  >
                    <Text style={[styles.chipText, idfuncao === String(f.idfuncao) && styles.chipTextSelected]}>
                      {f.descricaofuncao.charAt(0).toUpperCase() + f.descricaofuncao.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
  
              
              <TouchableOpacity style={styles.button} onPress={handleSaveStaff}>
                <Text style={styles.buttonText}>{editingId ? 'Salvar Alterações' : 'Cadastrar'}</Text>
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
  staffCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#94A3B8', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  role: { fontSize: 14, color: '#0284C7', marginBottom: 4, fontWeight: 'bold' },
  statusText: { fontSize: 12, color: '#64748B' },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  fab: { position: 'absolute', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#0284C7', borderRadius: 32, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { color: '#64748B', fontWeight: 'bold' },
  chipTextSelected: { color: '#FFF' },
  
  input: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
