import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { responsavelService } from '../services/responsavel.service';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [perfil, setPerfil] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await responsavelService.getPerfil();
      setPerfil(data);
      setNome(data.nome || '');
      setCelular(data.celular || '');
      setEmail(data.email || '');
      
      if (data.foto && typeof data.foto === 'string' && data.foto.startsWith('data:image')) {
        setFotoUri(data.foto);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await responsavelService.updatePerfil({ nome, celular, email });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      
      try {
        setLoading(true);
        const mimeType = result.assets[0].mimeType || 'image/jpeg';
        const fileName = result.assets[0].fileName || uri.split('/').pop() || 'photo.jpg';
        
        await responsavelService.atualizarFoto(uri, mimeType, fileName);
        Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao enviar foto');
        setFotoUri(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.mainContainer}>
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.cameraIcon}>📸</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeIcon}>✎</Text>
              </View>
            </TouchableOpacity>
            
            <Text style={styles.userName}>{perfil?.nome}</Text>
            <Text style={styles.userType}>{perfil?.descricaotipo || 'Responsável'}</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <Input label="Nome Completo" value={nome} onChangeText={setNome} iconName="person-outline" />
            <Input label="Celular" value={celular} onChangeText={setCelular} keyboardType="phone-pad" iconName="call-outline" />
            <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" iconName="mail-outline" />
            
            <Button 
              title="Salvar Alterações" 
              onPress={handleUpdate} 
              loading={loading}
              style={{ marginTop: 24 }}
            />
          </Card>

          <Button 
            title="Sair do Aplicativo" 
            variant="outline"
            onPress={signOut} 
            style={styles.logoutButton}
          />
          <View style={{ height: 40 }} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 0,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
      }
    })
  },
  headerBackground: {
    backgroundColor: '#0284C7',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
  },
  cameraIcon: {
    fontSize: 32,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0284C7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  userType: {
    fontSize: 14,
    color: '#E0F2FE',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
  },
  formContainer: {
    padding: 24,
    marginTop: -20,
  },
  card: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 24,
    borderColor: '#EF4444',
  },
});
