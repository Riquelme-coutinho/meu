import React from 'react';
import { View, StyleSheet, ViewStyle, ReactNode, Platform } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 16px rgba(100, 116, 139, 0.08)',
      },
      default: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
});
