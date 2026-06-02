import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Card } from '../components/Card';
import { responsavelService } from '../services/responsavel.service';
import { avisoService } from '../services/aviso.service';
import { notificacaoService } from '../services/notificacao.service';
import { StatusBar } from 'expo-status-bar';

export const HomeScreen = () => {
  const [perfil, setPerfil] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [avisos, setAvisos] = useState<any[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [perfilData, alunosData, avisosData, naoLidasData] = await Promise.all([
        responsavelService.getPerfil(),
        responsavelService.getAlunosComTurma(),
        avisoService.getAvisos(),
        notificacaoService.getContadorNaoLidas(),
      ]);

      setPerfil(perfilData);
      setAlunos(alunosData);
      setAvisos(avisosData);
      setNaoLidas(naoLidasData.contador || 0);
    } catch (error) {
      console.error('Erro ao carregar dados da Home', error);
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
        <StatusBar style="light" />
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingSubtitle}>Bem-vindo de volta,</Text>
              <Text style={styles.greetingTitle}>{perfil?.nome?.split(' ')[0] || 'Responsável'}!</Text>
            </View>
            {naoLidas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{naoLidas}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Seus Alunos</Text>
          {alunos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aluno vinculado.</Text>
          ) : (
            alunos.map((aluno, index) => (
              <Card key={index} style={styles.cardAluno}>
                <View style={styles.alunoInitials}>
                  <Text style={styles.alunoInitialsText}>
                    {(aluno.nome || 'A').substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.alunoInfoContainer}>
                  <Text style={styles.cardTitle}>{aluno.nome}</Text>
                  <Text style={styles.cardSubtitle}>Matrícula: {aluno.matricula}</Text>
                  <View style={styles.turmaBadge}>
                    <Text style={styles.turmaText}>
                      Turma {aluno.enturmacao?.[0]?.turma?.codigoturma || 'N/A'}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          )}

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Avisos da Escola</Text>
          {avisos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aviso no momento.</Text>
          ) : (
            avisos.map((aviso, index) => (
              <Card key={index} style={styles.cardAlert}>
                <View style={styles.alertHeader}>
                  <Text style={styles.avisoTitle}>{aviso.titulo}</Text>
                  <Text style={styles.avisoDate}>
                    {new Date(aviso.dataentrada).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text style={styles.avisoDesc}>{aviso.descricao}</Text>
              </Card>
            ))
          )}
          <View style={{ height: 60 }} />
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
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#E0F2FE',
    fontWeight: '600',
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: '#EF4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  content: {
    padding: 20,
    marginTop: -10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  cardAluno: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alunoInitials: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alunoInitialsText: {
    color: '#0284C7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alunoInfoContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  turmaBadge: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  turmaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  cardAlert: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  avisoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
    flex: 1,
  },
  avisoDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  avisoDesc: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
  emptyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});
