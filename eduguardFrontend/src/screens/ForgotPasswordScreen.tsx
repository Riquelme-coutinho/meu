import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';

export const ForgotPasswordScreen = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<any>();

  const formatCpf = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setCpf(cleaned);
  };

  const handleRequestCode = async () => {
    if (!cpf || cpf.length < 11) {
      Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, preencha um CPF válido.' });
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/esqueci-senha', { cpf });
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Código gerado! Verifique o terminal do backend.' });
      setStep(2);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!codigo || !novaSenha) {
      Toast.show({ type: 'error', text1: 'Atenção', text2: 'Preencha o código e a nova senha.' });
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/resetar-senha', { cpf, codigo, novaSenha });
      Toast.show({ type: 'success', text1: 'Senha alterada!', text2: 'Você já pode fazer login com a nova senha.' });
      navigation.navigate('Login');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? 'Informe seu CPF para receber o código de recuperação.' 
                : 'Insira o código de 6 dígitos e a sua nova senha.'}
            </Text>
          </View>

          {step === 1 ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu CPF"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={cpf}
                onChangeText={formatCpf}
                maxLength={11}
                returnKeyType="done"
                onSubmitEditing={handleRequestCode}
                editable={!loading}
              />
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleRequestCode}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Gerar Código</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Código de Recuperação</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={codigo}
                  onChangeText={setCodigo}
                  maxLength={6}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#94A3B8"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Redefinir Senha</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#7DD3FC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
