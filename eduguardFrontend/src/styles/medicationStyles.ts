import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ECFEFF', // Ciano bem clarinho (fundo)
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 0,
    backgroundColor: '#ECFEFF',
    minHeight: '100%',
  },
  headerBackground: {
    backgroundColor: '#0891B2', // Ciano vibrante (saúde)
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(8, 145, 178, 0.2)',
      },
      default: {
        shadowColor: '#0891B2',
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
    color: '#CFFAFE',
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
    borderWidth: 0,
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 16px rgba(8, 145, 178, 0.08)',
      },
      default: {
        shadowColor: '#0891B2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#164E63',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusAdministrado: {
    backgroundColor: '#10B981', // Verde
  },
  statusPendente: {
    backgroundColor: '#F59E0B', // Laranja
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0891B2',
    width: 70,
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  obsContainer: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#94A3B8',
  },
  obs: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#CFFAFE',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0891B2',
  },
  emptyText: {
    color: '#0891B2',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});