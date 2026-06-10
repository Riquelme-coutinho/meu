import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AdminNoticesScreen = () => {
  const [avisos, setAvisos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cargo, setCargo] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  
  // Selection
  const [escopo, setEscopo] = useState<'geral' | 'turma' | 'aluno'>('geral');
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedAluno, setSelectedAluno] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const userCargo = await AsyncStorage.getItem('@EduGuard:userRole');
      const userIdStr = await AsyncStorage.getItem('@EduGuard:userId');
      setCargo(userCargo?.toLowerCase() || '');
      setUserId(userIdStr ? Number(userIdStr) : null);

      const [resAvisos, resTurmas, resAlunos] = await Promise.all([
        api.get('/admin/avisos'),
        api.get('/admin/turmas'),
        api.get('/admin/alunos')
      ]);

      setAvisos(resAvisos.data || []);
      setTurmas(resTurmas.data || []);
      setAlunos(resAlunos.data || []);
      
      if (userCargo?.toLowerCase() === 'professor') {
        setEscopo('turma'); // Default to turma for professor
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter lists based on role
  const isProfessor = cargo === 'professor';
  const availableTurmas = isProfessor 
    ? turmas.filter((t: any) => t.idfuncionario === userId) 
    : turmas;

  // Filter students based on selected Turma if any
  const availableAlunos = selectedTurma 
    ? alunos.filter((a: any) => a.idturma === Number(selectedTurma)) 
    : alunos;

  const handleCreateAviso = async () => {
    if (!titulo || !descricao) {
      Toast.show({ type: 'error', text1: 'Preencha título e descrição.' });
      return;
    }
    if (escopo === 'turma' && !selectedTurma) {
      Toast.show({ type: 'error', text1: 'Selecione uma turma.' });
      return;
    }
    if (escopo === 'aluno' && !selectedAluno) {
      Toast.show({ type: 'error', text1: 'Selecione um aluno.' });
      return;
    }

    try {
      const payload: any = { titulo, descricao };
      if (escopo === 'turma') payload.idturma = Number(selectedTurma);
      if (escopo === 'aluno') payload.idaluno = Number(selectedAluno);

      await api.post('/admin/avisos', payload);
      Toast.show({ type: 'success', text1: 'Aviso disparado com sucesso!' });
      
      setTitulo('');
      setDescricao('');
      setSelectedTurma('');
      setSelectedAluno('');
      if (isProfessor) setEscopo('turma');
      else setEscopo('geral');
      
      fetchData();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erro ao enviar aviso.' });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Novo Aviso</Text>
          
          <Text style={styles.label}>Para quem enviar?</Text>
          <View style={styles.escopoContainer}>
            {!isProfessor && (
              <TouchableOpacity 
                style={[styles.escopoBtn, escopo === 'geral' && styles.escopoBtnSelected]} 
                onPress={() => setEscopo('geral')}
              >
                <Text style={[styles.escopoText, escopo === 'geral' && styles.escopoTextSelected]}>Geral</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.escopoBtn, escopo === 'turma' && styles.escopoBtnSelected]} 
              onPress={() => setEscopo('turma')}
            >
              <Text style={[styles.escopoText, escopo === 'turma' && styles.escopoTextSelected]}>Turma</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.escopoBtn, escopo === 'aluno' && styles.escopoBtnSelected]} 
              onPress={() => setEscopo('aluno')}
            >
              <Text style={[styles.escopoText, escopo === 'aluno' && styles.escopoTextSelected]}>Aluno</Text>
            </TouchableOpacity>
          </View>

          {/* Seleção de Turma */}
          {(escopo === 'turma' || escopo === 'aluno') && (
            <View style={{marginBottom: 16}}>
              <Text style={styles.label}>Selecionar Turma:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row'}}>
                {availableTurmas.map((t: any) => (
                  <TouchableOpacity 
                    key={t.idturma} 
                    style={[styles.chip, selectedTurma === String(t.idturma) && styles.chipSelected]}
                    onPress={() => {
                      setSelectedTurma(String(t.idturma));
                      setSelectedAluno(''); // reset aluno
                    }}
                  >
                    <Text style={[styles.chipText, selectedTurma === String(t.idturma) && styles.chipTextSelected]}>
                      {t.codigoturma}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Seleção de Aluno */}
          {escopo === 'aluno' && selectedTurma && (
             <View style={{marginBottom: 16}}>
             <Text style={styles.label}>Selecionar Aluno:</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row'}}>
               {availableAlunos.map((a: any) => (
                 <TouchableOpacity 
                   key={a.idaluno} 
                   style={[styles.chip, selectedAluno === String(a.idaluno) && styles.chipSelected]}
                   onPress={() => setSelectedAluno(String(a.idaluno))}
                 >
                   <Text style={[styles.chipText, selectedAluno === String(a.idaluno) && styles.chipTextSelected]}>
                     {a.nome.split(' ')[0]}
                   </Text>
                 </TouchableOpacity>
               ))}
               {availableAlunos.length === 0 && <Text style={{color: '#94A3B8'}}>Nenhum aluno nesta turma.</Text>}
             </ScrollView>
           </View>
          )}

          <TextInput style={styles.input} placeholder="Título do Aviso" value={titulo} onChangeText={setTitulo} />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Conteúdo do aviso..." 
            value={descricao} 
            onChangeText={setDescricao} 
            multiline 
            numberOfLines={4} 
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateAviso}>
            <Text style={styles.buttonText}>Disparar Aviso</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Avisos Recentes</Text>
        {loading ? <ActivityIndicator size="large" color="#0284C7" /> : (
          avisos.map((aviso: any, idx: number) => (
            <View key={idx} style={styles.avisoCard}>
              <Text style={styles.avisoTitle}>{aviso.titulo}</Text>
              <Text style={styles.avisoDesc}>{aviso.descricao}</Text>
              <Text style={styles.avisoDate}>Data: {new Date(aviso.dataentrada).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  formCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#334155' },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: '600' },
  
  escopoContainer: { flexDirection: 'row', marginBottom: 16 },
  escopoBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#F8FAFC' },
  escopoBtnSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  escopoText: { color: '#64748B', fontWeight: 'bold' },
  escopoTextSelected: { color: '#FFF' },

  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { color: '#64748B', fontWeight: 'bold' },
  chipTextSelected: { color: '#FFF' },

  input: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#0284C7', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  avisoCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#0284C7' },
  avisoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  avisoDesc: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  avisoDate: { fontSize: 12, color: '#94A3B8' }
});
