import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';

export const NotificationsScreen = () => {
  const [avisos, setAvisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  const fetchAvisos = async () => {
    try {
      const response = await api.get('/avisos');
      setAvisos(response.data || []);
    } catch (error) {
      handleError(error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchAvisos();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAvisos();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleResponder = async (idaviso: number) => {
    try {
      setSubmitting(idaviso);
      const resposta = respostas[idaviso] || '';
      await api.post(`/avisos/${idaviso}/responder`, { resposta });
      
      // Update local state instead of refetching for immediate feedback
      setAvisos(prev => prev.map(aviso => {
        if (aviso.idaviso === idaviso) {
          return {
            ...aviso,
            avisoresposta: [{ ciente: true, resposta, dataresposta: new Date().toISOString() }]
          };
        }
        return aviso;
      }
      ));
      
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(null);
    }
  };

  const handleRespostaChange = (idaviso: number, text: string) => {
    setRespostas(prev => ({ ...prev, [idaviso]: text }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
        ) : avisos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum aviso no momento</Text>
          </View>
        ) : (
          avisos.map((item, index) => {
            const hasAvisoResposta = item.avisoresposta && item.avisoresposta.length > 0;
            const respostaData = hasAvisoResposta ? item.avisoresposta[0] : null;

            return (
              <View key={item.idaviso || index} style={[styles.card, !hasAvisoResposta && styles.cardUnread]}>
                <View style={styles.headerRow}>
                  <Text style={[styles.notifTitle, !hasAvisoResposta && styles.notifTitleUnread]}>
                    {item.titulo}
                  </Text>
                  {!hasAvisoResposta && <View style={styles.unreadDot} />}
                </View>
                
                <Text style={styles.notifDesc}>{item.descricao}</Text>
                
                <View style={styles.footer}>
                  <Text style={styles.date}>
                    Publicado em: {new Date(item.datacadastro).toLocaleDateString('pt-BR')}
                  </Text>
                </View>

                {hasAvisoResposta ? (
                  <View style={styles.acknowledgedContainer}>
                    <Text style={styles.acknowledgedText}>
                      ✅ Ciente em {new Date(respostaData.dataresposta).toLocaleDateString('pt-BR')} às {new Date(respostaData.dataresposta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {respostaData.resposta ? (
                      <View style={styles.respostaBox}>
                        <Text style={styles.respostaLabel}>Sua resposta:</Text>
                        <Text style={styles.respostaText}>{respostaData.resposta}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View style={styles.actionContainer}>
                    <TextInput 
                      style={styles.input}
                      placeholder="Digite uma resposta opcional..."
                      value={respostas[item.idaviso] || ''}
                      onChangeText={(t) => handleRespostaChange(item.idaviso, t)}
                    />
                    <TouchableOpacity 
                      style={styles.cienteBtn}
                      onPress={() => handleResponder(item.idaviso)}
                      disabled={submitting === item.idaviso}
                    >
                      {submitting === item.idaviso ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.cienteBtnText}>Marcar como Ciente</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { color: '#64748B', fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardUnread: { borderLeftWidth: 4, borderLeftColor: '#0284C7' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  notifTitle: { fontSize: 16, fontWeight: '600', color: '#334155', flex: 1 },
  notifTitleUnread: { fontWeight: 'bold', color: '#0F172A' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0284C7', marginLeft: 8 },
  notifDesc: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  date: { fontSize: 12, color: '#94A3B8' },
  
  actionContainer: { marginTop: 16 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 },
  cienteBtn: { backgroundColor: '#0284C7', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cienteBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  
  acknowledgedContainer: { marginTop: 16, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  acknowledgedText: { color: '#16A34A', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  respostaBox: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#BBF7D0', paddingTop: 8 },
  respostaLabel: { fontSize: 12, color: '#15803D', fontWeight: '600', marginBottom: 2 },
  respostaText: { fontSize: 14, color: '#166534', fontStyle: 'italic' },
});