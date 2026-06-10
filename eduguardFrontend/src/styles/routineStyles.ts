import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ECFDF5', // Fundo verde super clarinho
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 0,
    backgroundColor: '#ECFDF5',
    minHeight: '100%',
  },
  headerBackground: {
    backgroundColor: '#059669', // Verde esmeralda forte
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(5, 150, 105, 0.2)',
      },
      default: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#D1FAE5', // Verde clarinho para o subtítulo
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    padding: 24,
    marginTop: -10,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 0, // Removendo borda para ficar mais limpo
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 16px rgba(5, 150, 105, 0.08)',
      },
      default: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alunoInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5', // Fundo da bolinha verde claro
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoInitialsText: {
    color: '#059669', // Letra da bolinha verde escuro
    fontSize: 16,
    fontWeight: 'bold',
  },
  alunoName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#064E3B',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusFeita: {
    backgroundColor: '#10B981', // Verde principal
  },
  statusPendente: {
    backgroundColor: '#FDE68A', // Amarelinho para destacar o pendente
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusTextFeita: {
    color: '#FFFFFF',
  },
  statusTextPendente: {
    color: '#92400E',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1FAE5',
    marginBottom: 16,
  },
  checklistDesc: {
    fontSize: 16,
    color: '#064E3B',
    fontWeight: '600',
    marginBottom: 12,
  },
  obsContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  obs: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#10B981',
    textAlign: 'right',
    fontWeight: '700',
  },
  emptyText: {
    color: '#059669',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});