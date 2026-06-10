import React, { useState, useRef } from 'react';
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
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';

export const RegisterScreen = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<any>();

  const cpfRef = useRef<TextInput>(null);
  const celularRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    if (!nome || !cpf || !celular || !email || !senha) {
      Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, preencha todos os campos.' });
      return;
    }

    try {
      setLoading(true);
      await api.post('/responsaveis', { nome, cpf, celular, email, senha });
      
      Toast.show({
        type: 'success',
        text1: 'Conta criada!',
        text2: 'Seu cadastro foi realizado com sucesso. Faça o login.',
      });

      navigation.goBack();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumbers = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(text.replace(/[^0-9]/g, ''));
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
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Faça parte da rede EduGuard</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
              returnKeyType="next"
              onSubmitEditing={() => cpfRef.current?.focus()}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              ref={cpfRef}
              style={styles.input}
              placeholder="Somente números"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={11}
              value={cpf}
              onChangeText={(t) => formatNumbers(t, setCpf)}
              returnKeyType="next"
              onSubmitEditing={() => celularRef.current?.focus()}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Celular</Text>
            <TextInput
              ref={celularRef}
              style={styles.input}
              placeholder="DDD + Número"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={11}
              value={celular}
              onChangeText={(t) => formatNumbers(t, setCelular)}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Seu melhor e-mail"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              onSubmitEditing={() => senhaRef.current?.focus()}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              ref={senhaRef}
              style={styles.input}
              placeholder="Crie uma senha forte"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.linkText}>Já tem conta? Faça Login</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0284C7',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
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
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#7DD3FC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: '#0284C7',
    fontSize: 15,
    fontWeight: '600',
  },
});
