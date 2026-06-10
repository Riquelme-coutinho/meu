import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';
import { handleError } from '../utils/errorHandler';

export const RoutineScreen = () => {
  const [rotinas, setRotinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchRotinas = async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const response = await api.get(`/checklists/?data=${formattedDate}`);
      setRotinas(response.data || []);
    } catch (error) {
      handleError(error);
    }
  };

  const loadData = async (date: Date) => {
    setLoading(true);
    await fetchRotinas(date);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRotinas(selectedDate);
    setRefreshing(false);
  }, [selectedDate]);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate]);

  const goToPrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  };

  const formatDateDisplay = () => {
    if (isToday()) return 'Hoje';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate.getDate() === yesterday.getDate() &&
        selectedDate.getMonth() === yesterday.getMonth() &&
        selectedDate.getFullYear() === yesterday.getFullYear()) {
      return 'Ontem';
    }

    return selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>

      <View style={styles.dateStepperContainer}>
        <Text onPress={goToPrevDay} style={styles.arrowButton}>{'<'}</Text>
        <Text style={styles.dateDisplay}>{formatDateDisplay()}</Text>
        <Text 
          onPress={!isToday() ? goToNextDay : undefined} 
          style={[styles.arrowButton, isToday() && styles.arrowDisabled]}
        >
          {'>'}
        </Text>
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
        ) : rotinas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isToday() ? 'Nenhuma rotina registrada para hoje' : 'Nenhuma rotina registrada para esta data'}
            </Text>
          </View>
        ) : (
          rotinas.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.headerRow}>
                <View style={styles.alunoInitials}>
                  <Text style={styles.alunoInitialsText}>
                    {(item.aluno?.nome || 'A').substring(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.alunoName}>{item.aluno?.nome || 'Aluno'}</Text>
                <View style={[styles.statusBadge, item.rotinafeita ? styles.statusFeita : styles.statusPendente]}>
                  <Text style={[styles.statusText, item.rotinafeita ? styles.statusTextFeita : styles.statusTextPendente]}>
                    {item.rotinafeita ? 'Feito' : 'Não Feito'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.checklistDesc}>{item.checklist?.descricao || 'Atividade não especificada'}</Text>
              
              {item.obsden_o && (
                <View style={styles.obsContainer}>
                  <Text style={styles.obsLabel}>Observação:</Text>
                  <Text style={styles.obsText}>{item.obsden_o}</Text>
                </View>
              )}
              
              <Text style={styles.date}>
                {item.datahorasys 
                  ? new Date(item.datahorasys).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                  : '--:--'}
              </Text>
            </View>
          ))
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
  dateStepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  arrowButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284C7',
    paddingHorizontal: 16,
  },
  arrowDisabled: {
    color: '#CBD5E1',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: 'bold',
    fontSize: 14,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusFeita: {
    backgroundColor: '#DCFCE7',
  },
  statusPendente: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTextFeita: {
    color: '#16A34A',
  },
  statusTextPendente: {
    color: '#DC2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  checklistDesc: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 8,
    fontWeight: '500',
  },
  obsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#94A3B8',
  },
  obsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
  },
  obsText: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },
});