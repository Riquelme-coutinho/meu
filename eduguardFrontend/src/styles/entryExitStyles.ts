import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFF7ED', // Laranja bem clarinho (fundo)
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 0,
    backgroundColor: '#FFF7ED',
    minHeight: '100%',
  },
  headerBackground: {
    backgroundColor: '#EA580C', // Laranja vibrante
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(234, 88, 12, 0.2)',
      },
      default: {
        shadowColor: '#EA580C',
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
    color: '#FFEDD5',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    padding: 24,
    marginTop: -10,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 16px rgba(234, 88, 12, 0.08)',
      },
      default: {
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEDD5', // Fundo do ícone
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  alunoName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#9A3412', // Laranja escuro
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#C2410C',
    fontWeight: '600',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  tipoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 14,
    color: '#9A3412',
    fontWeight: '700',
  },
  emptyText: {
    color: '#EA580C',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});