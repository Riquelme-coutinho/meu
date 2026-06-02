import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Card } from '../components/Card';
import { checklistService } from '../services/checklist.service';

export const RoutineScreen = () => {
  const [rotinas, setRotinas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await checklistService.getChecklists();
      setRotinas(data);
    } catch (error) {
      console.error('Erro ao carregar rotinas', error);
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
          <Text style={styles.title}>Rotina Diária</Text>
          <Text style={styles.subtitle}>Acompanhe as atividades dos seus alunos</Text>
        </View>

        <View style={styles.content}>
          {rotinas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma rotina registrada para hoje.</Text>
          ) : (
            rotinas.map((item, index) => (
              <Card key={index} style={styles.card}>
                <View style={styles.headerRow}>
                  <View style={styles.alunoInitials}>
                    <Text style={styles.alunoInitialsText}>
                      {(item.aluno?.nome || 'A').substring(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.alunoName}>{item.aluno?.nome || 'Aluno'}</Text>
                  <View style={[styles.statusBadge, item.rotinafeita ? styles.statusFeita : styles.statusPendente]}>
                    <Text style={[styles.statusText, item.rotinafeita ? styles.statusTextFeita : styles.statusTextPendente]}>
                      {item.rotinafeita ? 'Feito' : 'Pendente'}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.checklistDesc}>{item.checklist?.descricao}</Text>
                {item.obsden_o && (
                  <View style={styles.obsContainer}>
                    <Text style={styles.obs}>Obs: {item.obsden_o}</Text>
                  </View>
                )}
                <Text style={styles.date}>
                  {new Date(item.datahorasys).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alunoInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoInitialsText: {
    color: '#0284C7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alunoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusFeita: {
    backgroundColor: '#D1FAE5',
  },
  statusPendente: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusTextFeita: {
    color: '#059669',
  },
  statusTextPendente: {
    color: '#D97706',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  checklistDesc: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 12,
  },
  obsContainer: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  obs: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    fontWeight: '600',
  },
  emptyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
