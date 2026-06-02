import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image, StatusBar } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/auth.service';
import { AuthContext } from '../contexts/AuthContext';

export const LoginScreen = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!cpf || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha seu CPF e senha.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login(cpf, senha);
      if (data.token) {
        await signIn(data.token);
      } else {
        Alert.alert('Erro', 'Token não recebido. Verifique suas credenciais.');
      }
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (text: string) => {
    setCpf(text.replace(/[^0-9]/g, ''));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>EduGuard</Text>
            <Text style={styles.subtitle}>Acompanhe a rotina escolar do seu filho(a) de perto e em tempo real.</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="CPF do Responsável"
              placeholder="Digite seu CPF"
              keyboardType="number-pad"
              value={cpf}
              onChangeText={handleCpfChange}
              maxLength={11}
              iconName="person-outline"
            />
            
            <View style={{ height: 8 }} />
            
            <Input
              label="Senha de Acesso"
              placeholder="Digite sua senha secreta"
              value={senha}
              onChangeText={setSenha}
              iconName="lock-closed-outline"
              isPassword={true}
            />

            <Button 
              title="Acessar Minha Conta" 
              onPress={handleLogin} 
              loading={loading}
              style={styles.loginButton} 
            />
            
            <Button 
              title="Esqueci minha senha" 
              variant="ghost"
              onPress={() => Alert.alert('Recuperação', 'Entre em contato com a secretaria.')}
              style={styles.forgotPasswordButton} 
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 28,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(2, 132, 199, 0.15)',
      },
      default: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
      },
    }),
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: 24,
  },
  forgotPasswordButton: {
    marginTop: 4,
  },
});
