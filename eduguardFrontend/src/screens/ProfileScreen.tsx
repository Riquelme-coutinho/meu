import React, { useEffect, useState, useCallback, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';
import { AuthContext } from '../contexts/AuthContext';

export const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    celular: ''
  });

  const fetchUserData = async () => {
    try {
      const response = await api.get('/responsaveis/me');
      setUserData(response.data);
      setEditForm({
        nome: response.data.nome || '',
        email: response.data.email || '',
        celular: response.data.celular || ''
      });
    } catch (error) {
      handleError(error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchUserData();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await api.put('/responsaveis/me', editForm);
      setUserData(response.data);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.headerLogoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.headerLogoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
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
        ) : userData ? (
          <View>
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{getInitials(userData.nome)}</Text>
              </View>
              <Text style={styles.userName}>{userData.nome}</Text>
              <Text style={styles.userType}>Responsável</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                {!isEditing ? (
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setIsEditing(false);
                    setEditForm({
                      nome: userData.nome || '',
                      email: userData.email || '',
                      celular: userData.celular || ''
                    });
                  }}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome Completo</Text>
                  {isEditing ? (
                    <TextInput 
                      style={styles.input}
                      value={editForm.nome}
                      onChangeText={(t) => setEditForm(prev => ({...prev, nome: t}))}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userData.nome}</Text>
                  )}
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="card-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>CPF (Não editável)</Text>
                  <Text style={styles.infoValueMuted}>{formatCPF(userData.cpf)}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  {isEditing ? (
                    <TextInput 
                      style={styles.input}
                      value={editForm.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={(t) => setEditForm(prev => ({...prev, email: t}))}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userData.email}</Text>
                  )}
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="call-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Celular</Text>
                  {isEditing ? (
                    <TextInput 
                      style={styles.input}
                      value={editForm.celular}
                      keyboardType="phone-pad"
                      onChangeText={(t) => setEditForm(prev => ({...prev, celular: t}))}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userData.celular || 'Não informado'}</Text>
                  )}
                </View>
              </View>
              
              {isEditing && (
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Não foi possível carregar os dados.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  headerLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoutText: {
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  errorText: {
    color: '#64748B',
    fontSize: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userType: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  editButtonText: {
    color: '#0284C7',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  infoValueMuted: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutContainer: {
    marginTop: 8,
  },
});