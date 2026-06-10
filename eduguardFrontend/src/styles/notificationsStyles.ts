import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF5FF', // Fundo roxo muito clarinho
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 0,
    backgroundColor: '#FAF5FF',
    minHeight: '100%',
  },
  headerBackground: {
    backgroundColor: '#9333EA', // Roxo vibrante
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 20px rgba(147, 51, 234, 0.2)',
      },
      default: {
        shadowColor: '#9333EA',
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
    color: '#F3E8FF',
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
        boxShadow: '0px 8px 16px rgba(147, 51, 234, 0.06)',
      },
      default: {
        shadowColor: '#9333EA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
  cardUnread: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notifTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4C1D95', // Roxo super escuro
    flex: 1,
  },
  notifTitleUnread: {
    color: '#9333EA',
    fontWeight: '900',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A855F7',
    marginLeft: 12,
    marginTop: 4,
  },
  notifDesc: {
    fontSize: 15,
    color: '#581C87',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(216, 180, 254, 0.4)',
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9333EA',
  },
  markReadBtn: {
    fontSize: 13,
    color: '#7E22CE',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emptyText: {
    color: '#9333EA',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});