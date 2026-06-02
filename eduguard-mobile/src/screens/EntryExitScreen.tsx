import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Card } from '../components/Card';
import { entradaSaidaService } from '../services/entradaSaida.service';

export const EntryExitScreen = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await entradaSaidaService.getEntradaSaida();
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao carregar entradas e saídas', error);
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

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0284C7" />}
    >
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Portaria</Text>
          <Text style={styles.subtitle}>Histórico de Entradas e Saídas</Text>
        </View>

        <View style={styles.content}>
          {registros.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          ) : (
            registros.map((item, index) => {
              const isEntrada = item.descricao?.toLowerCase().includes('entrada');
              
              return (
                <Card key={index} style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.iconContainer}>
                      <Text style={{ fontSize: 20 }}>{isEntrada ? '📥' : '📤'}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={styles.alunoName}>{item.aluno?.nome || 'Aluno'}</Text>
                      <Text style={styles.infoText}>Validado por: {item.responsavel?.nome || 'Portaria'}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.tipoText}>{item.descricao}</Text>
                      <Text style={styles.date}>
                        {new Date(item.datahorasys).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
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
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  tipoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 14,
    color: '#475569',
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
