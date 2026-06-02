import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { Card } from '../components/Card';
import { notificacaoService } from '../services/notificacao.service';

export const NotificationsScreen = () => {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await notificacaoService.getNotificacoes();
      setNotificacoes(data);
    } catch (error) {
      console.error('Erro ao carregar notificações', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleMarcarComoLida = async (id: number) => {
    try {
      await notificacaoService.marcarComoVisualizada(id);
      setNotificacoes(prev => 
        prev.map(n => n.idnotificacao === id ? { ...n, visualizada: true } : n)
      );
    } catch (error) {
      console.error('Erro ao marcar como lida', error);
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0284C7" />}
    >
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Notificações</Text>
          <Text style={styles.subtitle}>Fique por dentro das atualizações</Text>
        </View>

        <View style={styles.content}>
          {notificacoes.length === 0 ? (
            <Text style={styles.emptyText}>Você não tem notificações no momento.</Text>
          ) : (
            notificacoes.map((item, index) => (
              <Card key={index} style={[styles.card, !item.visualizada && styles.cardUnread]}>
                <View style={styles.headerRow}>
                  <Text style={[styles.notifTitle, !item.visualizada && styles.notifTitleUnread]}>
                    {item.titulo}
                  </Text>
                  {!item.visualizada && <View style={styles.unreadDot} />}
                </View>
                
                <Text style={styles.notifDesc}>{item.mensagem}</Text>
                
                <View style={styles.footer}>
                  <Text style={styles.date}>
                    {new Date(item.dataenvio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {new Date(item.dataenvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  
                  {!item.visualizada && (
                    <TouchableOpacity onPress={() => handleMarcarComoLida(item.idnotificacao)}>
                      <Text style={styles.markReadBtn}>Marcar como lida</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))
          )}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardUnread: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  notifTitleUnread: {
    color: '#0284C7',
    fontWeight: '800',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0EA5E9',
    marginLeft: 12,
    marginTop: 4,
  },
  notifDesc: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  markReadBtn: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
  },
  emptyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
